-- Public configuration read path.
--
-- The booking form needs the list of treatment types, and the marketing pages
-- need the clinic's phone number and timings. Both are non-sensitive, but the
-- security model rests on one absolute: `anon` has NO table access. A policy
-- granting anon SELECT on treatment_types would be harmless in itself and
-- would also make that sentence untrue — after which every later reviewer has
-- to check which tables are the exceptions.
--
-- So config is read the same way bookings are written: through a narrow
-- SECURITY DEFINER function with an explicit column list. The column list is
-- the point. `select *` here would mean that adding, say, an internal note
-- field to clinic_settings later silently publishes it to the internet.

-- Active treatments, in display order. Duration is included because the
-- booking form shows "about 45 minutes" before a parent commits to a slot.
create or replace function get_treatment_types()
returns table (
  id               uuid,
  name             text,
  slug             text,
  duration_minutes int
)
language sql
stable
security definer
set search_path = public
as $$
  select t.id, t.name, t.slug, t.duration_minutes
    from treatment_types t
   where t.is_active
   order by t.sort_order, t.name;
$$;

-- Contact details and opening hours only. Explicitly NOT the rate-limit
-- ceilings, the pending TTL or the retention period — publishing the limits
-- of the throttle to the people it throttles is free reconnaissance.
create or replace function get_public_config()
returns table (
  phone_display        text,
  phone_href           text,
  whatsapp_href        text,
  timings_display      text,
  opening_hours        jsonb,
  timezone             text,
  booking_horizon_days int,
  booking_lead_hours   int
)
language sql
stable
security definer
set search_path = public
as $$
  select s.phone_display, s.phone_href, s.whatsapp_href, s.timings_display,
         s.opening_hours, s.timezone, s.booking_horizon_days, s.booking_lead_hours
    from clinic_settings s
   where s.id = 1;
$$;

revoke all on function get_treatment_types() from public;
revoke all on function get_public_config()   from public;
grant execute on function get_treatment_types() to anon, authenticated;
grant execute on function get_public_config()   to anon, authenticated;
