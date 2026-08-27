"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notifyAppointmentByReference } from "@/lib/notifications";
import type { RoomPreference } from "@/lib/supabase/types";

/**
 * The public booking path.
 *
 * Everything here runs through `request_appointment`, the SECURITY DEFINER
 * function in the database. The anon role has no table access at all, so this
 * action cannot write patient rows directly even if it tried — the RPC is the
 * only door, and it validates the slot, enforces the rate limits and writes
 * family + patient + appointment + consent in one transaction.
 */

export type BookingResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

/**
 * IP is hashed, never stored raw.
 *
 * We need to count requests per device to stop someone flooding the diary, but
 * an IP address attached to a child's booking is personal data we have no
 * reason to keep. A salted hash counts just as well and identifies nobody if
 * the table leaks.
 */
async function hashedIp(): Promise<string | null> {
  const h = await headers();
  const raw =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip");
  if (!raw) return null;

  // A dedicated salt, not a borrowed one. Reusing CRON_SECRET here would mean
  // rotating the cron credential silently resets every rate-limit window.
  const salt = process.env.IP_HASH_SALT ?? "tic-tac-tooth-dev-salt";
  return createHash("sha256").update(`${salt}:${raw}`).digest("hex").slice(0, 32);
}

export async function getAvailableSlots(
  dateKey: string,
  treatmentTypeId: string | null
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_available_slots", {
    p_date: dateKey,
    p_treatment_type_id: treatmentTypeId,
  });

  if (error) return [];
  return (data ?? []).map((r) => r.slot_start);
}

export async function requestAppointment(input: {
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
}): Promise<BookingResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("request_appointment", {
    p_starts_at: input.startsAtISO,
    p_treatment_type_id: input.treatmentTypeId,
    p_room_preference: input.roomPreference,
    p_concern: input.concern || null,
    p_patient_first_name: input.patientFirstName,
    p_patient_dob: input.patientDob,
    p_accessibility_notes: input.accessibilityNotes || null,
    p_parent_name: input.parentName,
    p_parent_mobile: input.parentMobile,
    p_parent_email: input.parentEmail || null,
    p_relationship: input.relationship,
    p_ip_hash: await hashedIp(),
  });

  if (error) {
    // The RPC raises readable messages for the cases a parent can act on —
    // slot gone, too many pending. The exclusion constraint can also fire if a
    // receptionist took the slot in the last instant.
    const message = error.message.includes("appointments_no_overlap")
      ? "Someone just took that time. Please choose another."
      : error.message.replace(/^.*?ERROR:\s*/i, "");

    return { ok: false, error: message || "We could not save that request." };
  }

  const reference = data as unknown as string;

  // Never let a notification problem cost a parent their booking — the slot is
  // already held and reception will see it regardless.
  await notifyAppointmentByReference(reference, "booking_received").catch(() => {});

  return { ok: true, reference };
}
