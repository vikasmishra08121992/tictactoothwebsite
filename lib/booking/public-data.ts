import "server-only";
import { createClient } from "@/lib/supabase/server";
import { clinic as fallbackClinic } from "@/lib/content/site";

/**
 * Public-facing configuration, read through the two SECURITY DEFINER functions
 * in migration 0005.
 *
 * Every function here degrades rather than throws. The marketing site existed
 * before the database did and must keep rendering if Supabase is unreachable —
 * a parent looking up the phone number during an outage is exactly when the
 * number matters most. So a failed read falls back to the hardcoded content,
 * and the booking form is the only surface that reports the failure out loud,
 * because that is the only one where proceeding would be misleading.
 */

export type PublicTreatment = {
  id: string;
  name: string;
  slug: string;
  duration_minutes: number;
};

export async function getTreatmentTypes(): Promise<PublicTreatment[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_treatment_types");
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export type PublicConfig = {
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  timingsDisplay: string;
  horizonDays: number;
  leadHours: number;
};

export async function getPublicConfig(): Promise<PublicConfig> {
  const fallback: PublicConfig = {
    phoneDisplay: fallbackClinic.phoneDisplay,
    phoneHref: fallbackClinic.phoneHref,
    whatsappHref: fallbackClinic.whatsappHref,
    timingsDisplay: fallbackClinic.timings,
    horizonDays: 60,
    leadHours: 12,
  };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_public_config");
    const row = data?.[0];
    if (error || !row) return fallback;

    return {
      phoneDisplay: row.phone_display ?? fallback.phoneDisplay,
      phoneHref: row.phone_href ?? fallback.phoneHref,
      whatsappHref: row.whatsapp_href ?? fallback.whatsappHref,
      timingsDisplay: row.timings_display ?? fallback.timingsDisplay,
      horizonDays: row.booking_horizon_days,
      leadHours: row.booking_lead_hours,
    };
  } catch {
    return fallback;
  }
}
