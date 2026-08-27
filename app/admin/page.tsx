import Link from "next/link";
import {
  CalendarDays,
  Settings,
  Users,
  FolderSearch,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/portal/page-header";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/scheduling/queries";
import { clinicToday } from "@/lib/scheduling/time";
import { formatInTimeZone } from "date-fns-tz";
import { addDays } from "date-fns";

export const dynamic = "force-dynamic";

/**
 * Admin overview.
 *
 * This route used to 404 — there were three admin pages and no index, so the
 * "Administration" nav had no home and anyone typing /admin hit the 404 page.
 *
 * It answers the two questions an administrator actually opens the portal for:
 * is anything waiting on a human, and is the clinic configured correctly. The
 * counts are counts, never names: this is a landing page that might be open on
 * a screen someone walks past, and there is no reason for it to display a
 * child's name to make its point.
 */

async function counts() {
  const supabase = await createClient();
  const settings = await getSettings();
  const tz = settings?.timezone ?? "Asia/Kolkata";
  const today = clinicToday(tz);

  const dayStart = new Date(`${today}T00:00:00+05:30`).toISOString();
  const dayEnd = addDays(new Date(dayStart), 1).toISOString();
  const weekEnd = addDays(new Date(dayStart), 7).toISOString();

  const [pending, todayCount, week, staff, treatments, closures] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .in("status", ["pending", "confirmed"])
        .gte("starts_at", dayStart)
        .lt("starts_at", dayEnd),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .in("status", ["pending", "confirmed"])
        .gte("starts_at", dayStart)
        .lt("starts_at", weekEnd),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("treatment_types")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("closures")
        .select("id", { count: "exact", head: true })
        .gte("ends_on", today),
    ]);

  return {
    settings,
    tz,
    today,
    pending: pending.count ?? 0,
    today_count: todayCount.count ?? 0,
    week: week.count ?? 0,
    staff: staff.count ?? 0,
    treatments: treatments.count ?? 0,
    closures: closures.count ?? 0,
  };
}

function Stat({
  label,
  value,
  hint,
  href,
  tone = "plain",
}: {
  label: string;
  value: number | string;
  hint?: string;
  href: string;
  tone?: "plain" | "attention";
}) {
  return (
    <Link
      href={href}
      className={`block rounded-2xl border-2 p-5 transition-shadow hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
        tone === "attention"
          ? "border-dashed border-gold bg-gold/25"
          : "border-transparent bg-white"
      }`}
    >
      <p className="text-sm font-semibold text-ink/85">{label}</p>
      <p className="mt-1 font-display text-4xl font-bold tabular-nums text-ink">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs leading-relaxed text-ink/85">{hint}</p>}
    </Link>
  );
}

function Shortcut({
  href,
  icon: Icon,
  title,
  body,
}: {
  href: string;
  icon: typeof Settings;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="flex gap-4 rounded-2xl bg-white p-5 transition-shadow hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-mint/50">
        <Icon className="size-5 text-teal-text" aria-hidden="true" />
      </span>
      <span>
        <span className="block font-display text-base font-bold text-ink">
          {title}
        </span>
        <span className="mt-0.5 block text-sm leading-relaxed text-ink/85">
          {body}
        </span>
      </span>
    </Link>
  );
}

export default async function AdminOverviewPage() {
  const c = await counts();

  const unconfigured = !c.settings?.phone_display?.trim().startsWith("+");

  return (
    <>
      <PageHeader
        title="Overview"
        description={`Everything about the clinic is set from here. Today is ${formatInTimeZone(
          new Date(`${c.today}T12:00:00Z`),
          "UTC",
          "EEEE d MMMM yyyy"
        )}.`}
      />

      <PageBody>
        {unconfigured && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-gold bg-gold/25 p-4">
            <AlertTriangle className="size-5 shrink-0 text-ink" aria-hidden="true" />
            <p className="flex-1 text-sm leading-relaxed text-ink">
              The clinic&apos;s phone number and timings are still placeholders,
              so the public site is showing them to parents. Set the real ones
              before launch.
            </p>
            <Link
              href="/admin/configuration"
              className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Set them now
            </Link>
          </div>
        )}

        <section aria-labelledby="today-heading">
          <h2 id="today-heading" className="sr-only">
            At a glance
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Awaiting confirmation"
              value={c.pending}
              hint={
                c.pending > 0
                  ? "Each one is holding a slot until it is confirmed or expires."
                  : "Nothing waiting on a phone call."
              }
              href="/staff?view=agenda&status=pending"
              tone={c.pending > 0 ? "attention" : "plain"}
            />
            <Stat
              label="Booked today"
              value={c.today_count}
              hint="Pending and confirmed."
              href={`/staff?view=day&date=${c.today}`}
            />
            <Stat
              label="Next seven days"
              value={c.week}
              hint="Pending and confirmed."
              href="/staff?view=agenda"
            />
            <Stat
              label="Active staff accounts"
              value={c.staff}
              hint="Everyone who can see patient records."
              href="/admin/people"
            />
          </div>
        </section>

        <section aria-labelledby="manage-heading" className="mt-10">
          <h2
            id="manage-heading"
            className="font-display text-lg font-bold text-ink"
          >
            Manage the clinic
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Shortcut
              href="/staff"
              icon={CalendarDays}
              title="Calendar"
              body="Day, week and month views. Confirm, move and cancel appointments, or add one by hand."
            />
            <Shortcut
              href="/admin/records"
              icon={FolderSearch}
              title="Patient & family records"
              body="Search, merge the duplicates online bookings create, and erase records on request."
            />
            <Shortcut
              href="/admin/configuration"
              icon={Settings}
              title="Configuration"
              body={`Opening hours, ${c.treatments} treatment types, ${c.closures} upcoming ${
                c.closures === 1 ? "closure" : "closures"
              }, and the contact details the public site shows.`}
            />
            <Shortcut
              href="/admin/people"
              icon={Users}
              title="Staff & access"
              body="Create accounts, change roles, and deactivate anyone who leaves on the day they leave."
            />
          </div>
        </section>

        <section aria-labelledby="housekeeping" className="mt-10">
          <h2
            id="housekeeping"
            className="font-display text-lg font-bold text-ink"
          >
            Running automatically
          </h2>
          <div className="mt-4 flex gap-4 rounded-2xl bg-white p-5">
            <Clock className="size-5 shrink-0 text-teal-text" aria-hidden="true" />
            <div className="text-sm leading-relaxed text-ink/85">
              <p>
                Unconfirmed online requests release their slot after{" "}
                <strong className="text-ink">
                  {c.settings?.pending_ttl_hours ?? 24} hours
                </strong>
                , and records past the{" "}
                <strong className="text-ink">
                  {Math.round((c.settings?.retention_months ?? 84) / 12)}-year
                </strong>{" "}
                retention period are deleted, both on an hourly job.
              </p>
              <p className="mt-2">
                If that job stops, slots leak and retention is no longer being
                enforced — which is a compliance problem, not just an untidy
                calendar. Check it is listed under Cron Jobs after each deploy.
              </p>
            </div>
          </div>
        </section>
      </PageBody>
    </>
  );
}
