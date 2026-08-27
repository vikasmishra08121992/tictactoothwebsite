import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Patient and family records.
 *
 * Every read here goes through the session-scoped client, so RLS decides what
 * comes back. That is deliberate — these queries never use the service role,
 * because a bug in a filter here should return nothing rather than return
 * another clinic's worth of children's records.
 */

export type FamilyRecord = {
  id: string;
  contact_name: string;
  mobile: string;
  email: string | null;
  relationship: string;
  is_provisional: boolean;
  merged_into_id: string | null;
  notes: string | null;
  created_at: string;
  patients: {
    id: string;
    first_name: string;
    date_of_birth: string | null;
    accessibility_notes: string | null;
  }[];
};

/**
 * Searches by contact name, mobile or child's first name.
 *
 * An empty query returns the most recent records rather than everything —
 * reception almost always wants "the one I just took a call about", and
 * loading every family on page one is both slow and a wider exposure of
 * children's names than the task needs.
 */
export async function searchFamilies(query: string): Promise<FamilyRecord[]> {
  const supabase = await createClient();
  const q = query.trim();

  let request = supabase
    .from("families")
    .select(
      `id, contact_name, mobile, email, relationship, is_provisional,
       merged_into_id, notes, created_at,
       patients ( id, first_name, date_of_birth, accessibility_notes )`
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (q) {
    // Postgres treats commas as the separator between .or() branches, so a
    // comma in the search box would silently produce a malformed filter.
    const safe = q.replace(/[,()]/g, " ");
    request = request.or(
      `contact_name.ilike.%${safe}%,mobile.ilike.%${safe}%`
    );
  }

  const { data } = await request;
  const families = (data ?? []) as unknown as FamilyRecord[];

  // Searching by a child's first name needs a second pass: PostgREST cannot
  // OR across an embedded resource and the parent table in one filter.
  if (q) {
    const safe = q.replace(/[,()]/g, " ");
    const { data: byChild } = await supabase
      .from("patients")
      .select(
        `families!inner ( id, contact_name, mobile, email, relationship,
                          is_provisional, merged_into_id, notes, created_at,
                          patients ( id, first_name, date_of_birth,
                                     accessibility_notes ) )`
      )
      .ilike("first_name", `%${safe}%`)
      .limit(50);

    const seen = new Set(families.map((f) => f.id));
    for (const row of (byChild ?? []) as unknown as { families: FamilyRecord }[]) {
      if (row.families && !seen.has(row.families.id)) {
        seen.add(row.families.id);
        families.push(row.families);
      }
    }
  }

  return families;
}

export type VisitRow = {
  id: string;
  reference: string;
  starts_at: string;
  status: string;
  treatment_types: { name: string } | null;
};

export async function getFamilyVisits(familyId: string): Promise<VisitRow[]> {
  const supabase = await createClient();
  const { data: patients } = await supabase
    .from("patients")
    .select("id")
    .eq("family_id", familyId);

  const ids = (patients ?? []).map((p) => p.id);
  if (ids.length === 0) return [];

  const { data } = await supabase
    .from("appointments")
    .select("id, reference, starts_at, status, treatment_types ( name )")
    .in("patient_id", ids)
    .order("starts_at", { ascending: false })
    .limit(100);

  return (data ?? []) as unknown as VisitRow[];
}
