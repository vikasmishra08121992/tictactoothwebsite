-- =============================================================================
-- Seed data.
--
-- Contains no patient data of any kind — only configuration. Fixtures for
-- testing are created by the test scripts so they can be torn down cleanly.
-- =============================================================================

insert into resources (name, sort_order) values ('Main chair', 0);

insert into clinic_settings (
  id, timezone, slot_minutes, buffer_minutes,
  opening_hours,
  booking_lead_hours, booking_horizon_days, pending_ttl_hours,
  max_pending_per_mobile, max_requests_per_ip_hr, retention_months,
  phone_display, phone_href, whatsapp_href, timings_display
) values (
  1, 'Asia/Kolkata', 15, 0,
  -- ISO weekday keys, 1 = Monday. Sunday (7) absent means closed.
  -- Split windows model the lunch break. [PLACEHOLDER: confirm real hours.]
  '{
    "1": [{"opens":"10:00","closes":"13:00"},{"opens":"14:00","closes":"19:00"}],
    "2": [{"opens":"10:00","closes":"13:00"},{"opens":"14:00","closes":"19:00"}],
    "3": [{"opens":"10:00","closes":"13:00"},{"opens":"14:00","closes":"19:00"}],
    "4": [{"opens":"10:00","closes":"13:00"},{"opens":"14:00","closes":"19:00"}],
    "5": [{"opens":"10:00","closes":"13:00"},{"opens":"14:00","closes":"19:00"}],
    "6": [{"opens":"10:00","closes":"13:00"},{"opens":"14:00","closes":"19:00"}]
  }'::jsonb,
  12, 60, 24,
  2, 6, 84,
  '[PLACEHOLDER: +91 9XXXX XXXXX]',
  'tel:+919000000000',
  'https://wa.me/919000000000',
  '[PLACEHOLDER: Mon–Sat, 10:00 AM – 7:00 PM IST]'
);

-- Treatment types available for online booking. `requires_review` is advisory
-- for reception — every online booking is pending regardless.
insert into treatment_types (name, slug, duration_minutes, requires_review, sort_order) values
  ('Routine check-up',                        'routine-check-up',       30, false, 0),
  ('Tooth pain or sensitivity',               'tooth-pain',             30, true,  1),
  ('Chipped, cracked or knocked-out tooth',   'dental-trauma',          45, true,  2),
  ('Cavity or filling',                       'cavity-filling',         45, false, 3),
  ('Braces or clear aligners consultation',   'orthodontic-consult',    45, false, 4),
  ('Special-needs / sensory-adapted visit',   'special-needs',          60, true,  5),
  ('Something else',                          'other',                  30, true,  6);

-- Version 1 of the consent wording. Stored verbatim so that a consent record
-- pointing at "version 1" still means something years later.
--
-- [LEGAL REVIEW REQUIRED] This is placeholder wording. It must be replaced
-- with text reviewed against DPDP Act 2023 §9 before the site goes live and
-- begins storing real children's data.
insert into consent_texts (version, body) values (
  1,
  'I confirm I am this child''s parent or legal guardian, and I consent to '
  'their information being used solely to schedule and prepare for this '
  'dental appointment. I understand I can ask for these records to be '
  'deleted at any time. [PLACEHOLDER — pending legal review.]'
);
