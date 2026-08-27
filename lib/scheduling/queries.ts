import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  AppointmentStatus,
  AppointmentWithPatient,
  ClinicSettings,
  TreatmentType,
} from "@/lib/supabase/types";

/**
 * Server-side reads for the staff and admin portals.
 *
 * `server-only` at the top is load-bearing: these queries return joined
 * patient rows, and importing them from a Client Component would be a build
 * error rather than a quiet leak of children's data into a browser bundle.
 *
 * Every query runs as the signed-in user, so RLS applies. Nothing here uses
 * the service-role client.
 */

export async function getSettings(): Promise<ClinicSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clinic_settings")
    .select("*")
    .eq("id", 1)
    .single();
  return data ?? null;
}

export async function getTreatmentTypes(): Promise<TreatmentType[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("treatment_types")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

/**
 * Appointments overlapping a date range, with the patient and family the
 * calendar needs to label them.
 *
 * Cancelled appointments are included so reception can see what was declined
 * or dropped out — the calendar filters them visually rather than hiding the
 * history entirely.
 */
export async function getAppointments(
  fromISO: string,
  toISO: string,
  statuses?: AppointmentStatus[] | null
): Promise<AppointmentWithPatient[]> {
  const supabase = await createClient();
  let query = supabase
    .from("appointments")
    .select(
      `*,
       patients ( *, families ( * ) ),
       treatment_types ( * )`
    )
    .gte("starts_at", fromISO)
    .lt("starts_at", toISO)
    .order("starts_at");

  // Filtered in the database rather than in the browser. Sending every
  // cancelled appointment to the client and hiding it with CSS would ship
  // children's names the user asked not to see.
  if (statuses && statuses.length > 0) query = query.in("status", statuses);

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AppointmentWithPatient[];
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // An account can be deactivated while its session is still valid. RLS
  // already refuses the data, but returning null here means the UI says
  // something useful instead of rendering an empty calendar.
  if (!data?.is_active) return null;
  return data;
}
