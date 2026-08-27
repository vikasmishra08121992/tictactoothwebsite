-- =============================================================================
-- The only two entry points the anonymous public gets.
--
-- Both are SECURITY DEFINER, so they bypass RLS deliberately and must police
-- themselves. Neither ever returns a patient, family or appointment row.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Expire stale pending requests.
--
-- A pending request holds its slot. Without expiry, a parent who abandons the
-- form halfway blocks that slot forever. Called by the availability function
-- (so availability is always truthful) and by a scheduled job.
-- ---------------------------------------------------------------------------

create or replace function expire_stale_pending()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  with expired as (
    update appointments
       set status        = 'cancelled',
           cancelled_at  = now(),
           cancel_reason = 'Expired — not confirmed in time'
     where status = 'pending'
       and expires_at is not null
       and expires_at < now()
    returning 1
  )
  select count(*) into n from expired;
  return n;
end;
$$;

-- ---------------------------------------------------------------------------
-- Free slots for a given date.
--
-- Returns times only. It deliberately does NOT return appointment rows: a
-- naive `select starts_at from appointments` to build the public booking
-- calendar would let anyone enumerate exactly when identifiable children are
-- in the building.
--
-- We do accept that a missing slot implies *someone* is booked. That is
-- unavoidable in any booking system and is acceptable — it reveals that the
-- clinic is busy, never who is in the chair.
-- ---------------------------------------------------------------------------

create or replace function get_available_slots(
  p_date date,
  p_treatment_type_id uuid default null
)
returns table (slot_start timestamptz)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  s              clinic_settings%rowtype;
  v_duration     int;
  v_tz           text;
  v_weekday      text;
  v_window       jsonb;
  v_open         timestamptz;
  v_close        timestamptz;
  v_cursor       timestamptz;
  v_earliest     timestamptz;
  v_latest       date;
begin
  select * into s from clinic_settings where id = 1;
  if not found then
    return;
  end if;

  v_tz := s.timezone;

  -- Closed all day?
  if exists (select 1 from closures c
              where p_date between c.starts_on and c.ends_on) then
    return;
  end if;

  -- Outside the bookable window?
  v_earliest := now() + make_interval(hours => s.booking_lead_hours);
  v_latest   := (now() at time zone v_tz)::date
                + make_interval(days => s.booking_horizon_days);
  if p_date > v_latest then
    return;
  end if;

  select coalesce(
           (select duration_minutes from treatment_types
             where id = p_treatment_type_id and is_active),
           30)
    into v_duration;

  v_weekday := extract(isodow from p_date)::text;

  for v_window in
    select * from jsonb_array_elements(coalesce(s.opening_hours -> v_weekday, '[]'::jsonb))
  loop
    v_open  := (p_date || ' ' || (v_window ->> 'opens')  )::timestamp at time zone v_tz;
    v_close := (p_date || ' ' || (v_window ->> 'closes') )::timestamp at time zone v_tz;

    v_cursor := v_open;
    while v_cursor + make_interval(mins => v_duration) <= v_close loop
      if v_cursor >= v_earliest
         and not exists (
           select 1
             from appointments a
            where a.status in ('pending', 'confirmed')
              and tstzrange(a.starts_at, a.ends_at)
                  && tstzrange(v_cursor,
                               v_cursor + make_interval(mins => v_duration + s.buffer_minutes))
         )
      then
        slot_start := v_cursor;
        return next;
      end if;

      v_cursor := v_cursor + make_interval(mins => s.slot_minutes);
    end loop;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Accept a booking request from the public site.
--
-- Writes family + patient + appointment + consent atomically, and returns only
-- a reference code.
--
-- Two things this deliberately does NOT do:
--
--  1. It never attaches to an existing family, even when the mobile number
--     matches one. A mobile typed into a public form is an unverified claim;
--     honouring it would hand one family's children and visit history to
--     anyone who guessed the number. Every online booking creates a
--     provisional family, and reception merges duplicates by hand.
--
--  2. It never trusts the caller for timing. Duration comes from the treatment
--     type, and the slot is re-validated here — a client could otherwise post
--     any start time it liked, including outside opening hours.
-- ---------------------------------------------------------------------------

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

  v_reference := upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));

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
revoke all on function get_available_slots(date, uuid) from public;
revoke all on function request_appointment(
  timestamptz, uuid, room_preference, text, text, date, text,
  text, text, text, text, text) from public;

grant execute on function get_available_slots(date, uuid) to anon, authenticated;
grant execute on function request_appointment(
  timestamptz, uuid, room_preference, text, text, date, text,
  text, text, text, text, text) to anon, authenticated;

-- expire_stale_pending is called internally and by the scheduled job only.
revoke all on function expire_stale_pending() from public;
grant execute on function expire_stale_pending() to authenticated, service_role;
