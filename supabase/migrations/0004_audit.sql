-- =============================================================================
-- Audit logging, by trigger.
--
-- Deliberately not done in application code. An audit row emitted from a
-- server action disappears the moment any code path forgets to call the
-- helper, and nothing fails loudly when it does. For access to children's
-- records that is not good enough — the log has to be impossible to bypass,
-- including by a future developer who adds a new write path.
-- =============================================================================

create or replace function audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_diff jsonb;
  v_id   uuid;
begin
  if tg_op = 'DELETE' then
    v_diff := to_jsonb(old);
    v_id   := old.id;
  elsif tg_op = 'INSERT' then
    v_diff := to_jsonb(new);
    v_id   := new.id;
  else
    -- Only the fields that actually changed, so the log stays readable.
    select jsonb_object_agg(key, jsonb_build_object('from', old_v, 'to', new_v))
      into v_diff
      from (
        select n.key, o.value as old_v, n.value as new_v
          from jsonb_each(to_jsonb(new)) n
          join jsonb_each(to_jsonb(old)) o using (key)
         where n.value is distinct from o.value
      ) changed;
    v_id := new.id;
  end if;

  insert into audit_log (actor_id, action, entity, entity_id, diff)
    values (auth.uid(), tg_op, tg_table_name, v_id, v_diff);

  return coalesce(new, old);
end;
$$;

create trigger audit_appointments
  after insert or update or delete on appointments
  for each row execute function audit_row_change();

create trigger audit_patients
  after insert or update or delete on patients
  for each row execute function audit_row_change();

create trigger audit_families
  after insert or update or delete on families
  for each row execute function audit_row_change();

create trigger audit_profiles
  after insert or update or delete on profiles
  for each row execute function audit_row_change();

create trigger audit_settings
  after update on clinic_settings
  for each row execute function audit_row_change();

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger touch_appointments before update on appointments
  for each row execute function touch_updated_at();
create trigger touch_patients before update on patients
  for each row execute function touch_updated_at();
create trigger touch_families before update on families
  for each row execute function touch_updated_at();
create trigger touch_profiles before update on profiles
  for each row execute function touch_updated_at();
create trigger touch_settings before update on clinic_settings
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Erasure on request (DPDP)
--
-- Hard delete, not a soft flag — an erasure request that leaves the data in
-- place has not been honoured. The deletion event itself is recorded, which is
-- the one trace that must survive.
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
begin
  if not is_admin() then
    raise exception 'Only an administrator may erase records'
      using errcode = '42501';
  end if;

  select count(*) into v_patients from patients where family_id = p_family_id;
  select count(*) into v_appts
    from appointments a join patients p on p.id = a.patient_id
   where p.family_id = p_family_id;

  -- Recorded before the cascade removes the rows that the triggers would
  -- otherwise log individually.
  insert into audit_log (actor_id, action, entity, entity_id, diff)
    values (auth.uid(), 'ERASE', 'families', p_family_id,
            jsonb_build_object('reason',   p_reason,
                               'patients', v_patients,
                               'appointments', v_appts));

  delete from families where id = p_family_id;
end;
$$;

revoke all on function erase_family(uuid, text) from public;
grant execute on function erase_family(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Retention purge, run on a schedule
-- ---------------------------------------------------------------------------

create or replace function purge_expired_records()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  s clinic_settings%rowtype;
  n int;
begin
  select * into s from clinic_settings where id = 1;
  if not found then return 0; end if;

  with gone as (
    delete from families f
     where not exists (
       select 1 from patients p
         join appointments a on a.patient_id = p.id
        where p.family_id = f.id
          and a.starts_at > now() - make_interval(months => s.retention_months)
     )
     and f.created_at < now() - make_interval(months => s.retention_months)
    returning 1
  )
  select count(*) into n from gone;

  insert into audit_log (actor_id, action, entity, entity_id, diff)
    values (null, 'PURGE', 'families', null,
            jsonb_build_object('removed', n,
                               'retention_months', s.retention_months));
  return n;
end;
$$;

revoke all on function purge_expired_records() from public;
grant execute on function purge_expired_records() to service_role;
