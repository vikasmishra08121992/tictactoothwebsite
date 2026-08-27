-- =============================================================================
-- Tic Tac Tooth — core schema
--
-- Design notes that are load-bearing, recorded here because they are not
-- obvious from the DDL alone:
--
--  * Capacity is scoped by `resource_id`, not baked into the table. The clinic
--    runs one chair today; a second chair must be an INSERT, not a migration.
--
--  * Overlap is prevented by an exclusion constraint rather than by an
--    application-level "is this slot free?" check. The realistic failure is a
--    parent booking online at the same instant a receptionist creates an
--    appointment in that slot — no read-then-write check can close that race.
--
--  * `patients.date_of_birth`, never an age column. Age is a fact that goes
--    stale; a stored "7" is wrong within a year. `appointments.age_at_booking`
--    separately records what the parent stated at the time, which is immutable
--    and is a different thing.
--
--  * Timestamps are `timestamptz`. Opening hours are stored as local times and
--    resolved against a date in the clinic timezone. India observes no DST, so
--    that resolution is unambiguous — the same pattern would be a bug in most
--    other markets.
-- =============================================================================

create extension if not exists btree_gist;
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type app_role as enum ('admin', 'receptionist');

create type appointment_status as enum (
  'pending',    -- requested online, holding the slot, awaiting reception
  'confirmed',
  'cancelled',
  'completed',
  'no_show'
);

create type appointment_source as enum ('online', 'staff');

create type room_preference as enum ('space', 'jungle', 'no_preference');

-- ---------------------------------------------------------------------------
-- Staff
-- ---------------------------------------------------------------------------

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  role        app_role not null default 'receptionist',
  full_name   text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table profiles is
  'Staff accounts. Created by an admin via the Admin API — there is no public sign-up.';

-- ---------------------------------------------------------------------------
-- Bookable capacity
-- ---------------------------------------------------------------------------

create table resources (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

comment on table resources is
  'A bookable unit of capacity (a chair). One row today. Adding a second row '
  'raises clinic capacity to two concurrent appointments with no schema change.';

-- ---------------------------------------------------------------------------
-- Clinic configuration — exactly one row
-- ---------------------------------------------------------------------------

create table clinic_settings (
  id                     int primary key default 1,
  timezone               text not null default 'Asia/Kolkata',

  -- Granularity of the booking grid. NOT the length of an appointment —
  -- that comes from treatment_types.duration_minutes. Availability finds
  -- contiguous free time of at least the treatment's duration.
  slot_minutes           int  not null default 15,
  buffer_minutes         int  not null default 0,

  -- Opening hours, keyed by ISO weekday (1 = Monday .. 7 = Sunday):
  --   { "1": [{"opens":"10:00","closes":"13:00"},
  --           {"opens":"14:00","closes":"19:00"}], ... }
  -- An absent or empty weekday means closed.
  opening_hours          jsonb not null default '{}'::jsonb,

  booking_lead_hours     int  not null default 12,
  booking_horizon_days   int  not null default 60,

  -- How long an unconfirmed online request holds its slot before expiring.
  -- Without this, an abandoned request blocks that slot indefinitely.
  pending_ttl_hours      int  not null default 24,

  -- Ceilings for the public booking endpoint. Pending requests hold slots,
  -- so an unthrottled endpoint is a denial-of-service on the schedule.
  max_pending_per_mobile int  not null default 2,
  max_requests_per_ip_hr int  not null default 6,

  retention_months       int  not null default 84,

  -- Contact details, surfaced on the public site. These replace the
  -- [PLACEHOLDER] values previously hardcoded in lib/content/site.ts.
  phone_display          text,
  phone_href             text,
  whatsapp_href          text,
  timings_display        text,

  updated_at             timestamptz not null default now(),
  constraint clinic_settings_singleton check (id = 1)
);

comment on constraint clinic_settings_singleton on clinic_settings is
  'Enforces a single settings row. Without it a second row eventually appears '
  'and the application silently reads whichever it happens to find first.';

create table closures (
  id          uuid primary key default gen_random_uuid(),
  starts_on   date not null,
  ends_on     date not null,
  reason      text not null,
  created_at  timestamptz not null default now(),
  constraint closures_range_valid check (ends_on >= starts_on)
);

create table treatment_types (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  duration_minutes int  not null default 30,
  -- Emergencies, sedation and special-needs appointments always want a human
  -- to look before the slot is committed.
  requires_review  boolean not null default false,
  is_active        boolean not null default true,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  constraint treatment_duration_positive check (duration_minutes > 0)
);

-- ---------------------------------------------------------------------------
-- Consent — stored as evidence, not as a boolean
-- ---------------------------------------------------------------------------

create table consent_texts (
  id          uuid primary key default gen_random_uuid(),
  version     int not null unique,
  body        text not null,
  effective_from timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

comment on table consent_texts is
  'The verbatim wording of each consent version. Recording that a parent '
  'agreed to "version 3" is worthless in two years without version 3 itself.';

-- ---------------------------------------------------------------------------
-- Families and patients
-- ---------------------------------------------------------------------------

create table families (
  id             uuid primary key default gen_random_uuid(),
  contact_name   text not null,
  mobile         text not null,
  email          text,
  relationship   text not null,

  -- True for anything created by an anonymous online booking. Online bookings
  -- NEVER attach to an existing family: a mobile number typed into a public
  -- form is an unverified claim, and treating it as identity would hand one
  -- family's children and visit history to anyone who guessed the number.
  -- Reception merges duplicates deliberately, seeing both records.
  is_provisional boolean not null default false,

  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- Set when reception merges this record into another.
  merged_into_id uuid references families(id) on delete set null
);

create index families_mobile_idx on families (mobile);
create index families_merged_idx on families (merged_into_id)
  where merged_into_id is not null;

create table patients (
  id                  uuid primary key default gen_random_uuid(),
  family_id           uuid not null references families(id) on delete cascade,
  first_name          text not null,
  date_of_birth       date,
  accessibility_notes text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index patients_family_idx on patients (family_id);

-- ---------------------------------------------------------------------------
-- Appointments
-- ---------------------------------------------------------------------------

create table appointments (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique,

  patient_id        uuid not null references patients(id) on delete cascade,
  resource_id       uuid not null references resources(id),
  treatment_type_id uuid references treatment_types(id),

  starts_at         timestamptz not null,
  ends_at           timestamptz not null,

  status            appointment_status not null default 'pending',
  source            appointment_source not null default 'online',
  room_preference   room_preference not null default 'no_preference',

  -- What the parent stated at booking time. Deliberately separate from
  -- patients.date_of_birth: this is a point-in-time claim, not a fact.
  age_at_booking    int,

  concern           text,
  staff_notes       text,

  -- Only meaningful while status = 'pending'.
  expires_at        timestamptz,

  created_by        uuid references profiles(id) on delete set null,
  confirmed_by      uuid references profiles(id) on delete set null,
  confirmed_at      timestamptz,
  cancelled_at      timestamptz,
  cancel_reason     text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint appointments_time_valid check (ends_at > starts_at),
  constraint appointments_age_sane
    check (age_at_booking is null or age_at_booking between 0 and 18)
);

-- The clinic treats patients aged 0-18. An 18-year-old booking for themselves
-- is an adult and sits outside the children's-data consent regime — flagged in
-- DECISIONS.md as a legal question, not silently handled here.

create index appointments_starts_idx on appointments (starts_at);
create index appointments_status_idx on appointments (status);
create index appointments_patient_idx on appointments (patient_id);
create index appointments_expiry_idx on appointments (expires_at)
  where status = 'pending';

-- The single most important constraint in this schema. Two writers racing for
-- the same slot cannot both win; the loser gets a constraint violation and
-- re-reads availability.
alter table appointments
  add constraint appointments_no_overlap
  exclude using gist (
    resource_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status in ('pending', 'confirmed'));

create table consents (
  id              uuid primary key default gen_random_uuid(),
  appointment_id  uuid not null references appointments(id) on delete cascade,
  family_id       uuid not null references families(id) on delete cascade,
  consent_text_id uuid not null references consent_texts(id),
  granted_by_name text not null,
  relationship    text not null,
  granted_at      timestamptz not null default now()
);

create index consents_appointment_idx on consents (appointment_id);

-- ---------------------------------------------------------------------------
-- Operational ledgers
-- ---------------------------------------------------------------------------

-- Rate-limiting ledger for the public booking endpoint.
create table booking_attempts (
  id          bigserial primary key,
  ip_hash     text,
  mobile      text,
  succeeded   boolean not null default false,
  created_at  timestamptz not null default now()
);

create index booking_attempts_ip_idx     on booking_attempts (ip_hash, created_at desc);
create index booking_attempts_mobile_idx on booking_attempts (mobile,  created_at desc);

create table notification_log (
  id             bigserial primary key,
  appointment_id uuid references appointments(id) on delete cascade,
  channel        text not null,
  template       text not null,
  status         text not null,
  provider_id    text,
  error          text,
  created_at     timestamptz not null default now()
);

create table audit_log (
  id          bigserial primary key,
  actor_id    uuid,
  action      text not null,
  entity      text not null,
  entity_id   uuid,
  diff        jsonb,
  created_at  timestamptz not null default now()
);

create index audit_log_entity_idx on audit_log (entity, entity_id, created_at desc);

comment on table audit_log is
  'Written by database triggers, never by application code. Audit rows emitted '
  'from server actions are lost silently the moment any path forgets to call '
  'the helper — not acceptable for access to children''s records.';
