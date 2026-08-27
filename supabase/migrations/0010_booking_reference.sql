-- =============================================================================
-- Booking references: a missing extension, and a collision waiting to happen.
--
-- DEFECT 1 — request_appointment failed outright on a real Supabase project.
--
--   The reference was built with `gen_random_bytes(4)`, which comes from
--   pgcrypto. 0001 runs `create extension if not exists pgcrypto`, and on
--   Supabase that is a silent no-op because pgcrypto is already installed —
--   into the `extensions` schema, not `public`. request_appointment pins
--   `search_path = public` (deliberately, so nothing can shadow its tables),
--   so the function was simply not on the path:
--
--     ERROR: function gen_random_bytes(integer) does not exist
--
--   Every online booking failed. It went unnoticed because `gen_random_uuid()`
--   — used for every table's primary key — has been a Postgres BUILT-IN since
--   13 and needs no extension, so the schema looked healthy.
--
--   Adding `extensions` to the search_path would have worked and would have
--   loosened the pin that stops search_path attacks. Dropping the dependency
--   is better: gen_random_uuid() is built in, always present, and needs no
--   extension in any environment this will ever run in.
--
-- DEFECT 2 — six hex characters on a UNIQUE column, with no retry.
--
--   `reference` is `text not null unique`, and the old value was 6 hex
--   characters — 24 bits, about 16.7 million values. By the birthday bound a
--   collision becomes more likely than not at roughly 4,800 appointments,
--   which a clinic seeing thirty patients a day reaches inside a year. The
--   result would have been a unique-violation surfacing to a parent as a
--   failed booking, at random, increasingly often, with nothing in the code
--   suggesting why.
--
--   Now eight characters (32 bits) AND a bounded retry that checks for an
--   existing reference before inserting. The unique constraint stays as the
--   final arbiter under concurrency; the loop means it should never fire.
-- =============================================================================

create or replace function request_appointment(
  p_starts_at         timestamptz,
  p_treatment_type_id uuid,
  p_room_preference   room_preference,
  p_concern           text,
  p_patient_first_name text,
  p_patient_dob       date,
  p_accessibility_notes text,
  p_parent_name       text,
  p_parent_mobile     text,
  p_parent_email      text,
  p_relationship      text,
  p_ip_hash           text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_try              int;
  s               clinic_settings%rowtype;
  v_duration      int;
  v_resource      uuid;
  v_family        uuid;
  v_patient       uuid;
  v_appointment   uuid;
  v_consent_text  uuid;
  v_reference     text;
  v_age           int;
begin
  select * into s from clinic_settings where id = 1;
  if not found then
    raise exception 'Clinic settings are not configured' using errcode = 'P0002';
  end if;

  -- Free anything that has timed out, so the availability check below is honest.
  perform expire_stale_pending();

  -- --- rate limiting ------------------------------------------------------
  -- Pending requests hold slots, so an unthrottled endpoint is a denial of
  -- service on the clinic's entire schedule, not merely spam.
  if p_ip_hash is not null and (
       select count(*) from booking_attempts
        where ip_hash = p_ip_hash
          and created_at > now() - interval '1 hour'
     ) >= s.max_requests_per_ip_hr then
    insert into booking_attempts (ip_hash, mobile, succeeded)
      values (p_ip_hash, p_parent_mobile, false);
    raise exception 'Too many booking attempts. Please call the clinic.'
      using errcode = 'P0001';
  end if;

  if (
       select count(*) from appointments a
         join patients pt on pt.id = a.patient_id
         join families f  on f.id  = pt.family_id
        where f.mobile = p_parent_mobile
          and a.status = 'pending'
     ) >= s.max_pending_per_mobile then
    insert into booking_attempts (ip_hash, mobile, succeeded)
      values (p_ip_hash, p_parent_mobile, false);
    raise exception 'You already have a pending request. Please call the clinic.'
      using errcode = 'P0001';
  end if;

  -- --- validate the slot server-side --------------------------------------
  select duration_minutes into v_duration
    from treatment_types
   where id = p_treatment_type_id and is_active;
  if v_duration is null then
    raise exception 'Unknown treatment type' using errcode = 'P0002';
  end if;

  if not exists (
    select 1
      from get_available_slots((p_starts_at at time zone s.timezone)::date,
                               p_treatment_type_id) g
     where g.slot_start = p_starts_at
  ) then
    raise exception 'That time is no longer available' using errcode = 'P0001';
  end if;

  select id into v_resource
    from resources where is_active order by sort_order limit 1;
  if v_resource is null then
    raise exception 'No bookable resource configured' using errcode = 'P0002';
  end if;

  select id into v_consent_text
    from consent_texts order by version desc limit 1;
  if v_consent_text is null then
    raise exception 'No consent text configured' using errcode = 'P0002';
  end if;

  -- --- write --------------------------------------------------------------
  insert into families (contact_name, mobile, email, relationship, is_provisional)
    values (p_parent_name, p_parent_mobile, p_parent_email, p_relationship, true)
    returning id into v_family;

  insert into patients (family_id, first_name, date_of_birth, accessibility_notes)
    values (v_family, p_patient_first_name, p_patient_dob, p_accessibility_notes)
    returning id into v_patient;

  v_age := case
             when p_patient_dob is null then null
             else extract(year from age(p_patient_dob))::int
           end;

  -- gen_random_uuid() is a Postgres built-in; gen_random_bytes() is not.
  -- Eight hex characters, retried on collision — see migration 0010 header.
  for v_try in 1..10 loop
    v_reference := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    exit when not exists (
      select 1 from appointments a where a.reference = v_reference
    );
    v_reference := null;
  end loop;

  if v_reference is null then
    raise exception 'Could not allocate a booking reference. Please call the clinic.'
      using errcode = 'P0001';
  end if;

  -- The exclusion constraint may still reject this insert if a receptionist
  -- took the slot between the availability check above and this write. That is
  -- the race the constraint exists for; the caller re-reads availability.
  insert into appointments (
    reference, patient_id, resource_id, treatment_type_id,
    starts_at, ends_at, status, source, room_preference,
    age_at_booking, concern, expires_at
  ) values (
    v_reference, v_patient, v_resource, p_treatment_type_id,
    p_starts_at, p_starts_at + make_interval(mins => v_duration),
    'pending', 'online', coalesce(p_room_preference, 'no_preference'),
    v_age, p_concern,
    now() + make_interval(hours => s.pending_ttl_hours)
  ) returning id into v_appointment;

  insert into consents (
    appointment_id, family_id, consent_text_id, granted_by_name, relationship
  ) values (
    v_appointment, v_family, v_consent_text, p_parent_name, p_relationship
  );

  insert into booking_attempts (ip_hash, mobile, succeeded)
    values (p_ip_hash, p_parent_mobile, true);

  return v_reference;
end;
$$;

-- Grant execute narrowly. These two functions are the entire public surface.

revoke all on function request_appointment(
  timestamptz, uuid, room_preference, text, text, date, text, text, text, text, text, text
) from public;

-- Granted to `authenticated` as well as `anon`, which looks odd on a public
-- endpoint and is deliberate: a receptionist signed in on the same browser is
-- the `authenticated` role, and testing the public form from the staff machine
-- must not fail with a permission error. The function's own rate limits and
-- slot validation apply identically either way.
grant execute on function request_appointment(
  timestamptz, uuid, room_preference, text, text, date, text, text, text, text, text, text
) to anon, authenticated;
