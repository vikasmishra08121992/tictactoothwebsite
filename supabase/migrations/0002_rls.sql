-- =============================================================================
-- Row Level Security — default deny, everywhere.
--
-- Supabase exposes these tables directly to the browser, and the anon key
-- ships inside the client bundle. If RLS is wrong here, a table of children's
-- names, dates of birth and parents' mobile numbers is world-readable by
-- anyone who opens devtools. There is no second line of defence.
--
-- The rules:
--   * `anon` gets NO table access at all. Not appointments, not patients,
--     not families, not even read-only.
--   * The public reaches the database through exactly two SECURITY DEFINER
--     functions (see 0003_functions.sql): one returns free times, one accepts
--     a booking request. Neither ever returns a patient row.
--   * Staff access is gated on a role read from `profiles`, and inactive
--     accounts are refused even if their session is still valid.
-- =============================================================================

alter table profiles          enable row level security;
alter table resources         enable row level security;
alter table clinic_settings   enable row level security;
alter table closures          enable row level security;
alter table treatment_types   enable row level security;
alter table consent_texts     enable row level security;
alter table families          enable row level security;
alter table patients          enable row level security;
alter table appointments      enable row level security;
alter table consents          enable row level security;
alter table booking_attempts  enable row level security;
alter table notification_log  enable row level security;
alter table audit_log         enable row level security;

-- No policies are declared for `anon` anywhere in this file. With RLS enabled
-- and no permissive policy, every anon read and write is refused by default.

-- ---------------------------------------------------------------------------
-- Role helpers
--
-- SECURITY DEFINER and a pinned search_path: without the pin, a caller who can
-- create objects in a schema earlier on the path could shadow `profiles` and
-- make this function return whatever they like.
-- ---------------------------------------------------------------------------

create or replace function auth_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from profiles
  where id = auth.uid()
    and is_active            -- a deactivated account keeps its session but loses access
$$;

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth_role() is not null
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth_role() = 'admin'
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create policy profiles_self_read on profiles
  for select to authenticated
  using (id = auth.uid() or is_staff());

create policy profiles_admin_write on profiles
  for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Reference data — staff read, admin write
-- ---------------------------------------------------------------------------

create policy resources_staff_read on resources
  for select to authenticated using (is_staff());
create policy resources_admin_write on resources
  for all to authenticated using (is_admin()) with check (is_admin());

create policy settings_staff_read on clinic_settings
  for select to authenticated using (is_staff());
create policy settings_admin_write on clinic_settings
  for all to authenticated using (is_admin()) with check (is_admin());

create policy closures_staff_read on closures
  for select to authenticated using (is_staff());
create policy closures_admin_write on closures
  for all to authenticated using (is_admin()) with check (is_admin());

create policy treatments_staff_read on treatment_types
  for select to authenticated using (is_staff());
create policy treatments_admin_write on treatment_types
  for all to authenticated using (is_admin()) with check (is_admin());

create policy consent_texts_staff_read on consent_texts
  for select to authenticated using (is_staff());
create policy consent_texts_admin_write on consent_texts
  for all to authenticated using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Patient data — staff only, no exceptions
-- ---------------------------------------------------------------------------

create policy families_staff_all on families
  for all to authenticated using (is_staff()) with check (is_staff());

create policy patients_staff_all on patients
  for all to authenticated using (is_staff()) with check (is_staff());

create policy appointments_staff_all on appointments
  for all to authenticated using (is_staff()) with check (is_staff());

create policy consents_staff_read on consents
  for select to authenticated using (is_staff());

-- Consent records are evidence. Staff may read them; nobody edits them
-- through the API, because an editable consent record proves nothing.
-- They are written only by the SECURITY DEFINER booking function.

-- ---------------------------------------------------------------------------
-- Ledgers
-- ---------------------------------------------------------------------------

create policy notifications_staff_read on notification_log
  for select to authenticated using (is_staff());

create policy audit_admin_read on audit_log
  for select to authenticated using (is_admin());

-- booking_attempts has no policy at all: it is written only by the booking
-- function running as definer, and read by nobody through the API.

-- ---------------------------------------------------------------------------
-- Realtime
--
-- Realtime honours RLS, so only staff sessions receive appointment payloads.
-- Worth being explicit that these payloads carry children's data — this
-- publication must never be widened to anon.
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table appointments;
