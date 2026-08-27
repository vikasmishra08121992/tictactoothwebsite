import { CalendarShell } from "@/components/calendar/calendar-shell";
import {
  getAppointments,
  getSettings,
  getTreatmentTypes,
  getCurrentProfile,
} from "@/lib/scheduling/queries";
import { clinicToday } from "@/lib/scheduling/time";
import { daysFor, parseView, parseStatus, statusesFor } from "@/lib/scheduling/view";
import { addDays } from "date-fns";

// Patient data must never be cached or prerendered.
export const dynamic = "force-dynamic";

export default async function StaffCalendarPage({
  searchParams,
}: PageProps<"/staff">) {
  const params = await searchParams;
  const profile = await getCurrentProfile();
  const settings = await getSettings();

  if (!settings) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-8">
        <h1 className="text-2xl font-bold text-ink">Not configured yet</h1>
        <p className="mt-3 leading-relaxed text-ink/85">
          The clinic settings row is missing, so the calendar has no opening
          hours to draw. Run <code className="font-mono">supabase/seed.sql</code>{" "}
          against the database, then reload.
        </p>
      </div>
    );
  }

  // The whole view is derived from the URL, so the range the server fetches
  // and the range the grid draws can never disagree.
  const view = parseView(params.view);
  const status = parseStatus(params.status);
  const anchor =
    typeof params.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.date)
      ? params.date
      : clinicToday(settings.timezone);

  const days = daysFor(view, anchor);

  // A day either side, so an appointment near a boundary in clinic time is not
  // clipped off the edge of the grid.
  const from = addDays(new Date(`${days[0]}T00:00:00Z`), -1);
  const to = addDays(new Date(`${days[days.length - 1]}T00:00:00Z`), 2);

  const [appointments, treatmentTypes] = await Promise.all([
    getAppointments(from.toISOString(), to.toISOString(), statusesFor(status)),
    getTreatmentTypes(),
  ]);

  return (
    <CalendarShell
      initialAppointments={appointments}
      settings={settings}
      treatmentTypes={treatmentTypes}
      view={view}
      anchor={anchor}
      status={status}
      canManage={!!profile}
    />
  );
}
