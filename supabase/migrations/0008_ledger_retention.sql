-- =============================================================================
-- Retention for the two ledgers, which the original purge missed.
--
-- `purge_expired_records` removed families past the retention period and
-- nothing else. Two tables were quietly accumulating personal data outside
-- that period, and outside what the privacy notice tells parents:
--
--  1. booking_attempts stores the parent's mobile number in the clear, so that
--     the rate limiter can count pending requests per mobile. That is a fair
--     use, but the count only looks back an hour or so — the row is useless
--     within a day and was being kept forever. A mobile number is personal
--     data whether or not we think of the table as a ledger, and it survived
--     erase_family entirely: a parent could ask for erasure, be told it was
--     done, and leave their number behind in a table nobody thought about.
--
--  2. notification_log.error stores whatever the email or WhatsApp provider
--     said went wrong, which routinely includes the recipient's address.
--     The row cascades when the appointment goes, so the retention purge and
--     erasure both reach it — but a failed send for an appointment that was
--     never created leaves the address with nothing to cascade from.
--
-- Fix: both are trimmed on the same schedule as everything else, and
-- erase_family now clears the attempts belonging to the family it erases.
-- =============================================================================

-- Long enough to investigate a burst of abuse, far beyond any rate-limit
-- window, and short enough that a mobile number is not sitting there a month
-- later for no reason.
create or replace function purge_ledgers()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  n_attempts int;
  n_notifs   int;
begin
  with gone as (
    delete from booking_attempts
     where created_at < now() - interval '7 days'
    returning 1
  )
  select count(*) into n_attempts from gone;

  -- Orphans only: anything still attached to an appointment is governed by
  -- that appointment's retention and must not be trimmed out from under it.
  with gone as (
    delete from notification_log
     where appointment_id is null
       and created_at < now() - interval '30 days'
    returning 1
  )
  select count(*) into n_notifs from gone;

  insert into audit_log (actor_id, action, entity, entity_id, diff)
    values (null, 'PURGE', 'ledgers', null,
            jsonb_build_object('booking_attempts', n_attempts,
                               'notification_log', n_notifs));

  return n_attempts + n_notifs;
end;
$$;

revoke all on function purge_ledgers() from public;
grant execute on function purge_ledgers() to service_role;

-- ---------------------------------------------------------------------------
-- Erasure must reach the rate-limit ledger too
-- ---------------------------------------------------------------------------

create or replace function erase_family(p_family_id uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_patients int;
  v_appts    int;
  v_mobile   text;
begin
  if not is_admin() then
    raise exception 'Only an administrator may erase records'
      using errcode = '42501';
  end if;

  select mobile into v_mobile from families where id = p_family_id;

  select count(*) into v_patients from patients where family_id = p_family_id;
  select count(*) into v_appts
    from appointments a join patients p on p.id = a.patient_id
   where p.family_id = p_family_id;

  -- Recorded before the cascade removes the rows that the triggers would
  -- otherwise log individually.
  --
  -- The reason is free text typed by a member of staff. It is stored because
  -- "deleted on this date, because they asked" is what makes the erasure
  -- demonstrable — but it is the one field here that could contain a name if
  -- someone types one, which is why the admin UI asks them not to and the
  -- privacy notice says plainly that a reason is kept.
  insert into audit_log (actor_id, action, entity, entity_id, diff)
    values (auth.uid(), 'ERASE', 'families', p_family_id,
            jsonb_build_object('reason',   p_reason,
                               'patients', v_patients,
                               'appointments', v_appts));

  delete from families where id = p_family_id;

  -- Not covered by the cascade: booking_attempts has no foreign key, by
  -- design, because it must accept rows for bookings that were rejected and
  -- therefore never became a family.
  if v_mobile is not null then
    delete from booking_attempts where mobile = v_mobile;
  end if;
end;
$$;

revoke all on function erase_family(uuid, text) from public;
grant execute on function erase_family(uuid, text) to authenticated;
