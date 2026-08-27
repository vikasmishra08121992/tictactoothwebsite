/**
 * Database types.
 *
 * Hand-maintained to match supabase/migrations/*.sql. Once a Supabase project
 * exists, replace this file wholesale with generated output:
 *
 *   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
 *
 * Keeping it hand-written in the meantime means the app is fully type-checked
 * before any project is provisioned — but it will drift if a migration lands
 * without updating it, so regenerate as soon as there is something to generate
 * from.
 */

export type AppRole = "admin" | "receptionist";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type AppointmentSource = "online" | "staff";

export type RoomPreference = "space" | "jungle" | "no_preference";

/** One opening window. A weekday may have several (e.g. either side of lunch). */
export type OpeningWindow = { opens: string; closes: string };

/** Keyed by ISO weekday as a string: "1" = Monday … "7" = Sunday. */
export type OpeningHours = Record<string, OpeningWindow[]>;

export type Profile = {
  id: string;
  role: AppRole;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Resource = {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type ClinicSettings = {
  id: number;
  timezone: string;
  slot_minutes: number;
  buffer_minutes: number;
  opening_hours: OpeningHours;
  booking_lead_hours: number;
  booking_horizon_days: number;
  pending_ttl_hours: number;
  max_pending_per_mobile: number;
  max_requests_per_ip_hr: number;
  retention_months: number;
  phone_display: string | null;
  phone_href: string | null;
  whatsapp_href: string | null;
  timings_display: string | null;
  updated_at: string;
};

export type Closure = {
  id: string;
  starts_on: string;
  ends_on: string;
  reason: string;
  created_at: string;
};

export type TreatmentType = {
  id: string;
  name: string;
  slug: string;
  duration_minutes: number;
  requires_review: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Family = {
  id: string;
  contact_name: string;
  mobile: string;
  email: string | null;
  relationship: string;
  is_provisional: boolean;
  notes: string | null;
  merged_into_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Patient = {
  id: string;
  family_id: string;
  first_name: string;
  date_of_birth: string | null;
  accessibility_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  reference: string;
  patient_id: string;
  resource_id: string;
  treatment_type_id: string | null;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  source: AppointmentSource;
  room_preference: RoomPreference;
  age_at_booking: number | null;
  concern: string | null;
  staff_notes: string | null;
  expires_at: string | null;
  created_by: string | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type ConsentText = {
  id: string;
  version: number;
  body: string;
  effective_from: string;
  created_at: string;
};

export type Consent = {
  id: string;
  appointment_id: string;
  family_id: string;
  consent_text_id: string;
  granted_by_name: string;
  relationship: string;
  granted_at: string;
};

export type NotificationLogRow = {
  id: number;
  appointment_id: string | null;
  channel: string;
  template: string;
  status: string;
  provider_id: string | null;
  error: string | null;
  created_at: string;
};

export type AuditLogRow = {
  id: number;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  diff: unknown;
  created_at: string;
};

/** An appointment with the joined rows the calendar actually renders. */
export type AppointmentWithPatient = Appointment & {
  patients: (Patient & { families: Family | null }) | null;
  treatment_types: TreatmentType | null;
};

/**
 * Supabase's client infers result types from this shape, and it needs
 * `Relationships` present — without it, `.single()` resolves to `never` and
 * every field access becomes a type error.
 */
type Row<T> = {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Row<Profile>;
      resources: Row<Resource>;
      clinic_settings: Row<ClinicSettings>;
      closures: Row<Closure>;
      treatment_types: Row<TreatmentType>;
      families: Row<Family>;
      patients: Row<Patient>;
      appointments: Row<Appointment>;
      consents: Row<Consent>;
      consent_texts: Row<ConsentText>;
      notification_log: Row<NotificationLogRow>;
      audit_log: Row<AuditLogRow>;
    };
    Views: Record<never, never>;
    Functions: {
      get_available_slots: {
        Args: { p_date: string; p_treatment_type_id?: string | null };
        Returns: { slot_start: string }[];
      };
      request_appointment: {
        Args: {
          p_starts_at: string;
          p_treatment_type_id: string;
          p_room_preference: RoomPreference;
          p_concern: string | null;
          p_patient_first_name: string;
          p_patient_dob: string | null;
          p_accessibility_notes: string | null;
          p_parent_name: string;
          p_parent_mobile: string;
          p_parent_email: string | null;
          p_relationship: string;
          p_ip_hash: string | null;
        };
        Returns: string;
      };
      merge_families: {
        Args: { p_source_id: string; p_target_id: string };
        Returns: void;
      };
      erase_family: {
        Args: { p_family_id: string; p_reason: string };
        Returns: void;
      };
      get_treatment_types: {
        Args: Record<never, never>;
        Returns: {
          id: string;
          name: string;
          slug: string;
          duration_minutes: number;
        }[];
      };
      get_public_config: {
        Args: Record<never, never>;
        Returns: {
          phone_display: string | null;
          phone_href: string | null;
          whatsapp_href: string | null;
          timings_display: string | null;
          opening_hours: Record<string, { opens: string; closes: string }[]>;
          timezone: string;
          booking_horizon_days: number;
          booking_lead_hours: number;
        }[];
      };
      expire_stale_pending: { Args: Record<never, never>; Returns: number };
      purge_expired_records: { Args: Record<never, never>; Returns: number };
      purge_ledgers: { Args: Record<never, never>; Returns: number };
    };
    Enums: {
      app_role: AppRole;
      appointment_status: AppointmentStatus;
      appointment_source: AppointmentSource;
      room_preference: RoomPreference;
    };
    CompositeTypes: Record<never, never>;
  };
};
