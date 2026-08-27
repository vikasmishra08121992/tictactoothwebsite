import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Scheduled maintenance: expiry and retention.
 *
 * Two jobs, both of which must keep running or the system quietly degrades:
 *
 *  - `expire_stale_pending` frees slots held by online requests nobody ever
 *    confirmed. Without it, "pending holds the slot" fills the diary with
 *    abandoned requests and the clinic stops taking bookings.
 *  - `purge_expired_records` deletes records past the configured retention
 *    period. Keeping children's data longer than the stated period is the
 *    breach, so a silently failing cron is a compliance failure, not a
 *    housekeeping one — which is why this returns counts and a non-200 on
 *    error rather than swallowing problems.
 *
 * Vercel Cron calls this with the CRON_SECRET as a bearer token.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  // Refusing to run without a configured secret is deliberate: an open
  // endpoint that deletes patient records is worse than one that never runs.
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured." },
      { status: 500 }
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const [expired, purged, ledgers] = await Promise.all([
    supabase.rpc("expire_stale_pending"),
    supabase.rpc("purge_expired_records"),
    supabase.rpc("purge_ledgers"),
  ]);

  const errors = [expired.error, purged.error, ledgers.error]
    .filter(Boolean)
    .map((e) => e!.message);

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    slotsFreed: expired.data,
    recordsPurged: purged.data,
    ledgerRowsPurged: ledgers.data,
    ranAt: new Date().toISOString(),
  });
}
