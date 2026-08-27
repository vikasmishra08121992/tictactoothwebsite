-- =============================================================================
-- Two defects in the audit design, both of which defeat erasure.
--
-- DEFECT 1 — the audit log was a shadow copy of every patient record.
--
--   audit_row_change() wrote to_jsonb(new) on INSERT and to_jsonb(old) on
--   DELETE. So every family insert copied the parent's name, mobile and email
--   into audit_log, every patient insert copied a child's first name and date
--   of birth, and every delete copied the whole row again on the way out.
--
--   The consequence is that erase_family did not erase. It deleted the
--   families row, the cascade deleted the children, and every one of those
--   deletions wrote the full record into a table that erase_family does not
--   touch — with audit_log readable by any administrator. A parent exercising
--   their right to erasure under DPDP Act 2023 §9 would have had their child's
--   name and date of birth moved, not removed. The same applies to the
--   retention purge: data past its retention period survived in the log.
--
--   Fix: for tables holding patient data, the log records WHICH COLUMNS
--   changed, never their values. That still answers the questions an audit log
--   exists to answer — who touched this record, when, and what kind of change
--   was it — and it stops the log accumulating the data it is auditing.
--
--   Config tables keep full values, because "who changed the opening hours
--   from what to what" is the whole point there and none of it is personal.
--
-- DEFECT 2 — staff could delete patient records directly.
--
--   families_staff_all granted `for all`, which includes DELETE. A
--   receptionist could therefore delete a family through the ordinary API,
--   bypassing erase_family entirely — bypassing its admin-only check and the
--   recorded reason that makes an erasure demonstrable afterwards.
--
--   Fix: no policy grants DELETE on families or patients. erase_family is
--   SECURITY DEFINER, so it still works; it becomes the only way.
-- =============================================================================

-- Tables whose column VALUES must never enter the audit log.
create or replace function audit_is_personal(p_table text)
returns boolean
language sql
immutable
as $$
  select p_table in ('families', 'patients', 'appointments', 'consents');
$$;

create or replace function audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_diff     jsonb;
  v_id       uuid;
  v_personal boolean := audit_is_personal(tg_table_name);
begin
  if tg_op = 'DELETE' then
    v_id   := old.id;
    v_diff := case when v_personal
                   then jsonb_build_object('redacted', true)
                   else to_jsonb(old) end;

  elsif tg_op = 'INSERT' then
    v_id   := new.id;
    v_diff := case when v_personal
                   then jsonb_build_object('redacted', true)
                   else to_jsonb(new) end;

  else
    v_id := new.id;

    if v_personal then
      -- Column names only. Enough to see that a child's date of birth was
      -- edited, without the log holding either the old or the new one.
      select jsonb_build_object(
               'redacted', true,
               'fields', coalesce(jsonb_agg(key order by key), '[]'::jsonb))
        into v_diff
        from (
          select n.key
            from jsonb_each(to_jsonb(new)) n
            join jsonb_each(to_jsonb(old)) o using (key)
           where n.value is distinct from o.value
        ) changed;
    else
      select jsonb_object_agg(key, jsonb_build_object('from', old_v, 'to', new_v))
        into v_diff
        from (
          select n.key, o.value as old_v, n.value as new_v
            from jsonb_each(to_jsonb(new)) n
            join jsonb_each(to_jsonb(old)) o using (key)
           where n.value is distinct from o.value
        ) changed;
    end if;
  end if;

  insert into audit_log (actor_id, action, entity, entity_id, diff)
    values (auth.uid(), tg_op, tg_table_name, v_id, v_diff);

  return coalesce(new, old);
end;
$$;

-- Any rows written by the previous version already hold patient data. Redact
-- them rather than leaving the defect behind in historical rows.
update audit_log
   set diff = jsonb_build_object('redacted', true, 'redacted_by', 'migration 0007')
 where audit_is_personal(entity)
   and diff is not null
   and not (diff ? 'redacted');

-- ---------------------------------------------------------------------------
-- Close the direct-delete path
-- ---------------------------------------------------------------------------

drop policy if exists families_staff_all on families;
drop policy if exists patients_staff_all on patients;

create policy families_staff_read on families
  for select to authenticated using (is_staff());
create policy families_staff_insert on families
  for insert to authenticated with check (is_staff());
create policy families_staff_update on families
  for update to authenticated using (is_staff()) with check (is_staff());

create policy patients_staff_read on patients
  for select to authenticated using (is_staff());
create policy patients_staff_insert on patients
  for insert to authenticated with check (is_staff());
create policy patients_staff_update on patients
  for update to authenticated using (is_staff()) with check (is_staff());

-- Deliberately no DELETE policy on either table. Removing a child's record is
-- erase_family's job: admin-only, reason required, and logged as an erasure.

-- Appointments keep their delete path closed for the same reason — a
-- cancelled appointment is a status, not an absence. Cancelling preserves the
-- history reception needs; deleting hides that anything ever happened.
drop policy if exists appointments_staff_all on appointments;

create policy appointments_staff_read on appointments
  for select to authenticated using (is_staff());
create policy appointments_staff_insert on appointments
  for insert to authenticated with check (is_staff());
create policy appointments_staff_update on appointments
  for update to authenticated using (is_staff()) with check (is_staff());
