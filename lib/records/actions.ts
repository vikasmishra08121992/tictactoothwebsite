"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Record maintenance.
 *
 * Authorisation is enforced in the database, not here. `merge_families`
 * checks `is_staff()` and `erase_family` checks `is_admin()` inside the
 * function body, so these wrappers cannot grant access by forgetting a check —
 * the worst a mistake here can do is show a confusing error message.
 */

export async function mergeFamilies(
  sourceId: string,
  targetId: string
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("merge_families", {
    p_source_id: sourceId,
    p_target_id: targetId,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/records");
  revalidatePath("/staff");
  return { ok: true };
}

/**
 * Hard deletion, on request, under DPDP Act 2023 §9.
 *
 * This removes the family and every child and appointment beneath it. The
 * reason is required and stored in the audit log — the deletion itself is the
 * one thing we keep, because "we deleted it, on this date, because they asked"
 * is what makes the erasure demonstrable later.
 */
export async function eraseFamily(
  familyId: string,
  reason: string
): Promise<Result> {
  if (!reason.trim()) {
    return { ok: false, error: "A reason is required before erasing records." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("erase_family", {
    p_family_id: familyId,
    p_reason: reason.trim(),
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/records");
  return { ok: true };
}

export async function updateFamilyNotes(
  familyId: string,
  notes: string
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("families")
    .update({ notes: notes.trim() || null })
    .eq("id", familyId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/records");
  return { ok: true };
}
