"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { AppRole, OpeningHours } from "@/lib/supabase/types";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Admin-only operations.
 *
 * RLS is the real gate — an admin policy guards every write these perform. The
 * explicit `requireAdmin()` below is there so a receptionist gets a readable
 * message instead of a bare Postgres permission error, not because it is the
 * security boundary.
 */
async function requireAdmin(): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You are not signed in." };

  const { data } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!data?.is_active || data.role !== "admin")
    return { ok: false, error: "Only an administrator can change this." };
  return { ok: true };
}

export async function updateSettings(input: {
  slot_minutes: number;
  buffer_minutes: number;
  booking_lead_hours: number;
  booking_horizon_days: number;
  pending_ttl_hours: number;
  max_pending_per_mobile: number;
  max_requests_per_ip_hr: number;
  retention_months: number;
  phone_display: string;
  phone_href: string;
  whatsapp_href: string;
  timings_display: string;
  opening_hours: OpeningHours;
}): Promise<Result> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;

  // Guard rails on the numbers that can quietly break scheduling. A zero slot
  // length makes the availability loop non-terminating; a zero TTL expires
  // every request the instant it arrives.
  if (input.slot_minutes < 5 || input.slot_minutes > 120)
    return { ok: false, error: "Slot length must be between 5 and 120 minutes." };
  if (input.pending_ttl_hours < 1)
    return { ok: false, error: "Pending requests must be held for at least an hour." };
  if (input.booking_horizon_days < 1)
    return { ok: false, error: "The booking window must be at least a day." };
  if (input.retention_months < 1)
    return { ok: false, error: "Retention must be at least a month." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("clinic_settings")
    .update(input)
    .eq("id", 1);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/configuration");
  revalidatePath("/staff");
  revalidatePath("/", "layout"); // contact details feed the public site
  return { ok: true };
}

export async function upsertTreatmentType(input: {
  id?: string;
  name: string;
  slug: string;
  duration_minutes: number;
  requires_review: boolean;
  is_active: boolean;
  sort_order: number;
}): Promise<Result> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;

  if (input.duration_minutes < 5)
    return { ok: false, error: "An appointment needs at least 5 minutes." };

  const supabase = await createClient();
  const { error } = input.id
    ? await supabase.from("treatment_types").update(input).eq("id", input.id)
    : await supabase.from("treatment_types").insert(input);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/configuration");
  return { ok: true };
}

export async function addClosure(input: {
  starts_on: string;
  ends_on: string;
  reason: string;
}): Promise<Result> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("closures").insert(input);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/configuration");
  revalidatePath("/staff");
  return { ok: true };
}

export async function removeClosure(id: string): Promise<Result> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("closures").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/configuration");
  revalidatePath("/staff");
  return { ok: true };
}

/**
 * Create a staff account.
 *
 * Uses the service-role client because creating an auth user is an Admin API
 * operation — but only after `requireAdmin()` has confirmed the *caller* is an
 * admin. Reaching for the service role without that check first would let any
 * signed-in receptionist mint themselves an admin account.
 */
export async function inviteStaff(input: {
  email: string;
  fullName: string;
  role: AppRole;
  temporaryPassword: string;
}): Promise<Result> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;

  if (input.temporaryPassword.length < 12)
    return { ok: false, error: "Use a temporary password of at least 12 characters." };

  const admin = createServiceClient();

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: input.email.trim(),
    password: input.temporaryPassword,
    email_confirm: true,
  });

  if (createErr || !created.user)
    return { ok: false, error: createErr?.message ?? "Could not create the account." };

  const { error: profileErr } = await admin.from("profiles").insert({
    id: created.user.id,
    full_name: input.fullName.trim(),
    role: input.role,
    is_active: true,
  });

  if (profileErr) {
    // Without this, a failed profile insert leaves an auth user with no
    // profile — able to sign in, invisible to the staff list, and refused by
    // every RLS policy. Confusing to debug and awkward to clean up.
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, error: profileErr.message };
  }

  revalidatePath("/admin/people");
  return { ok: true };
}

export async function setStaffActive(
  id: string,
  isActive: boolean
): Promise<Result> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id === id && !isActive)
    return { ok: false, error: "You cannot deactivate your own account." };

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/people");
  return { ok: true };
}

export async function setStaffRole(id: string, role: AppRole): Promise<Result> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Losing the last admin would leave the configuration unreachable by anyone.
  if (user?.id === id && role !== "admin") {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .eq("is_active", true);

    if ((count ?? 0) <= 1)
      return {
        ok: false,
        error: "You are the only administrator. Promote someone else first.",
      };
  }

  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/people");
  return { ok: true };
}
