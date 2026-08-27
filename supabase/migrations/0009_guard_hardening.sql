-- =============================================================================
-- Two defects found by scripts/rls-probe.mjs on the first real database.
--
-- DEFECT 1 — is_admin() returned NULL, so `if not is_admin()` never fired.
--
--   auth_role() returns NULL when there is no signed-in user. is_admin() was
--   `select auth_role() = 'admin'`, and in SQL `null = 'admin'` is NULL, not
--   false. So is_admin() returned NULL for an anonymous caller.
--
--   In an RLS policy that is harmless: Postgres treats a NULL USING result as
--   false and denies the row. In procedural code it is the opposite of
--   harmless — `not NULL` is NULL, `if NULL then` does not fire, and the guard
--   falls through. erase_family therefore ran its deletion for an anonymous
--   caller. Exploiting it needed a family's UUID, which is not guessable, but
--   the check that was supposed to stop it was doing nothing at all.
--
--   is_staff() was accidentally fine — `x is not null` yields false, never
--   NULL. That is luck, not design, so both are made explicit here.
--
--   The lesson generalises: a three-valued function must never be the whole
--   condition in a guard. coalesce at the source, once, rather than at every
--   call site where someone might forget.
--
-- DEFECT 2 — `revoke ... from public` did not revoke anything from anon.
--
--   Supabase ships `alter default privileges in schema public grant all on
--   functions to anon, authenticated, service_role`. Every function created
--   here therefore got an EXPLICIT grant to anon at creation time. Revoking
--   from PUBLIC removes the PUBLIC pseudo-role grant and leaves that explicit
--   one untouched — so expire_stale_pending, purge_expired_records and
--   erase_family were all reachable with the key that ships in the browser
--   bundle. purge_expired_records deletes families past their retention
--   period; that is not something an anonymous caller may trigger.
--
--   Fix: revoke from anon by name, and change the default so that anything
--   added later is denied unless it is granted deliberately.
-- =============================================================================

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth_role() is not null, false)
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth_role() = 'admin', false)
$$;

-- ---------------------------------------------------------------------------
-- Deny by default from here on
--
-- Applies to functions created later by this role. Anything genuinely public
-- is granted explicitly — see 0005_public_config.sql — so the default being
-- "no" costs nothing and closes this hole permanently.
-- ---------------------------------------------------------------------------

alter default privileges in schema public
  revoke execute on functions from anon;

-- ---------------------------------------------------------------------------
-- Revoke what is already granted
--
-- Named one at a time rather than swept: a blanket revoke across the schema
-- would also strip get_available_slots, get_treatment_types, get_public_config
-- and request_appointment, which are the four the public site depends on.
-- ---------------------------------------------------------------------------

revoke execute on function is_staff()  from anon;
revoke execute on function is_admin()  from anon;
revoke execute on function auth_role() from anon;

revoke execute on function expire_stale_pending()  from anon;
revoke execute on function purge_expired_records() from anon;
revoke execute on function purge_ledgers()         from anon;
revoke execute on function erase_family(uuid, text)     from anon;
revoke execute on function merge_families(uuid, uuid)   from anon;

-- The purges are scheduled jobs. They were never granted to authenticated and
-- must not be — they delete patient records in bulk.
revoke execute on function purge_expired_records() from authenticated;
revoke execute on function purge_ledgers()         from authenticated;

-- Trigger functions. Trigger firing does not check EXECUTE on the function, so
-- removing anon's grant cannot break auditing; it only stops anon calling them
-- directly and writing arbitrary rows into audit_log.
revoke execute on function audit_row_change()      from anon;
revoke execute on function audit_is_personal(text) from anon;
revoke execute on function touch_updated_at()      from anon;
