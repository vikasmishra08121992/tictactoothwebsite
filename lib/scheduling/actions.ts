"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { notifyAppointment } from "@/lib/notifications";
import type { RoomPreference } from "@/lib/supabase/types";

/**
 * Staff actions on appointments.
 *
 * Every one of these runs as the signed-in user, so RLS is the authority on
 * whether it is allowed — these functions do not re-implement permissions,
 * they just surface the failure readably.
 */

type Result = { ok: true } | { ok: false; error: string };

/** The exclusion constraint's error code, surfaced as something a human can act on. */
function readableError(message: string): string {
  if (message.includes("appointments_no_overlap")) {
    return "That slot was taken while you were editing. Please pick another time.";
  }
  if (message.includes("appointments_time_valid")) {
    return "The end time must be after the start time.";
  }
  return message;
}

export async function confirmAppointment(id: string): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("appointments")
    .update({
      status: "confirmed",
      confirmed_by: user?.id ?? null,
      confirmed_at: new Date().toISOString(),
      expires_at: null, // a confirmed appointment no longer times out
    })
    .eq("id", id);

  if (error) return { ok: false, error: readableError(error.message) };

  // Notification failures must never undo a confirmation — reception has
  // already told the parent, in their head, that this is booked.
  await notifyAppointment(id, "booking_confirmed").catch(() => {});

  revalidatePath("/staff");
  revalidatePath("/admin");
  return { ok: true };
}

export async function cancelAppointment(
  id: string,
  reason: string
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancel_reason: reason,
      expires_at: null,
    })
    .eq("id", id);

  if (error) return { ok: false, error: readableError(error.message) };

  await notifyAppointment(id, "booking_cancelled").catch(() => {});

  revalidatePath("/staff");
  revalidatePath("/admin");
  return { ok: true };
}

export async function setAppointmentStatus(
  id: string,
  status: "completed" | "no_show"
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) return { ok: false, error: readableError(error.message) };
  revalidatePath("/staff");
  revalidatePath("/admin");
  return { ok: true };
}

export async function rescheduleAppointment(
  id: string,
  startsAtISO: string,
  endsAtISO: string
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ starts_at: startsAtISO, ends_at: endsAtISO })
    .eq("id", id);

  if (error) return { ok: false, error: readableError(error.message) };

  await notifyAppointment(id, "booking_rescheduled").catch(() => {});

  revalidatePath("/staff");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateStaffNotes(
  id: string,
  notes: string
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ staff_notes: notes })
    .eq("id", id);

  if (error) return { ok: false, error: readableError(error.message) };
  revalidatePath("/staff");
  return { ok: true };
}

/**
 * Create an appointment from the calendar.
 *
 * Staff-created bookings go straight to `confirmed` — a receptionist taking a
 * call already *is* the confirmation step, so leaving these pending would put
 * them in a queue waiting for themselves.
 *
 * A family is created for each booking here too. Reception can merge
 * afterwards, deliberately, having seen both records — the same rule that
 * applies to online bookings, for the same reason.
 */
export async function createStaffAppointment(input: {
  startsAtISO: string;
  treatmentTypeId: string;
  roomPreference: RoomPreference;
  concern: string;
  patientFirstName: string;
  patientDob: string | null;
  accessibilityNotes: string;
  parentName: string;
  parentMobile: string;
  parentEmail: string;
  relationship: string;
  staffNotes: string;
  existingFamilyId?: string | null;
}): Promise<Result & { reference?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: treatment } = await supabase
    .from("treatment_types")
    .select("duration_minutes")
    .eq("id", input.treatmentTypeId)
    .single();

  if (!treatment) return { ok: false, error: "Unknown treatment type." };

  const { data: resource } = await supabase
    .from("resources")
    .select("id")
    .eq("is_active", true)
    .order("sort_order")
    .limit(1)
    .single();

  if (!resource) return { ok: false, error: "No bookable chair is configured." };

  let familyId = input.existingFamilyId ?? null;

  if (!familyId) {
    const { data: family, error: famErr } = await supabase
      .from("families")
      .insert({
        contact_name: input.parentName,
        mobile: input.parentMobile,
        email: input.parentEmail || null,
        relationship: input.relationship,
        is_provisional: false, // entered by staff, so it is not a guess
      })
      .select("id")
      .single();

    if (famErr || !family)
      return { ok: false, error: famErr?.message ?? "Could not save the family." };
    familyId = family.id;
  }

  const { data: patient, error: patErr } = await supabase
    .from("patients")
    .insert({
      family_id: familyId,
      first_name: input.patientFirstName,
      date_of_birth: input.patientDob,
      accessibility_notes: input.accessibilityNotes || null,
    })
    .select("id")
    .single();

  if (patErr || !patient)
    return { ok: false, error: patErr?.message ?? "Could not save the patient." };

  const starts = new Date(input.startsAtISO);
  const ends = new Date(starts.getTime() + treatment.duration_minutes * 60_000);
  const reference = Math.random().toString(16).slice(2, 8).toUpperCase();

  const age = input.patientDob
    ? Math.floor(
        (Date.now() - new Date(input.patientDob).getTime()) / 31_557_600_000
      )
    : null;

  const { error } = await supabase.from("appointments").insert({
    reference,
    patient_id: patient.id,
    resource_id: resource.id,
    treatment_type_id: input.treatmentTypeId,
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    status: "confirmed",
    source: "staff",
    room_preference: input.roomPreference,
    age_at_booking: age,
    concern: input.concern || null,
    staff_notes: input.staffNotes || null,
    created_by: user?.id ?? null,
    confirmed_by: user?.id ?? null,
    confirmed_at: new Date().toISOString(),
  });

  if (error) return { ok: false, error: readableError(error.message) };

  revalidatePath("/staff");
  revalidatePath("/admin");
  return { ok: true, reference };
}
