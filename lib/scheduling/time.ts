import { formatInTimeZone } from "date-fns-tz";
import { addDays, addMinutes, differenceInMinutes } from "date-fns";
import type { OpeningHours, OpeningWindow } from "@/lib/supabase/types";

/**
 * Time helpers for the calendar and the booking flow.
 *
 * Everything is stored as an instant (`timestamptz`) and rendered in the
 * clinic's timezone, never the viewer's. A receptionist checking the schedule
 * from a phone still set to another timezone must see clinic time, and a
 * parent booking while travelling must not be shown slots shifted by their
 * device.
 *
 * Opening hours are stored as local wall-clock strings ("10:00") and resolved
 * against a date. That resolution is only unambiguous because India does not
 * observe DST — in a DST market, a stored "10:00" is two different instants
 * twice a year and this approach would be a bug.
 */

export const CLINIC_TZ = "Asia/Kolkata";

export function formatTime(instant: string | Date, tz = CLINIC_TZ) {
  return formatInTimeZone(instant, tz, "h:mm a");
}

export function formatDate(instant: string | Date, tz = CLINIC_TZ) {
  return formatInTimeZone(instant, tz, "d MMM yyyy");
}

export function formatDayLabel(instant: string | Date, tz = CLINIC_TZ) {
  return formatInTimeZone(instant, tz, "EEE d");
}

/** `yyyy-MM-dd` in clinic time — the key used for day lookups. */
export function toDateKey(instant: string | Date, tz = CLINIC_TZ) {
  return formatInTimeZone(instant, tz, "yyyy-MM-dd");
}

/** Today in clinic time, which is not always today where the viewer is. */
export function clinicToday(tz = CLINIC_TZ) {
  return formatInTimeZone(new Date(), tz, "yyyy-MM-dd");
}

/*
 * `weekDaysFor` used to live here and has been deleted rather than fixed.
 *
 * It built a Date from a bare date string (parsed in the runtime's local zone),
 * ran date-fns `startOfWeek` (also local), then formatted the result as a UTC
 * date key. On a machine set to IST that returned the Sunday before the
 * intended Monday — the calendar opened on the wrong week, and only in zones
 * east of UTC, so it would have looked fine to anyone testing in Europe.
 *
 * Week and month ranges now come from lib/scheduling/view.ts, which does the
 * arithmetic entirely in UTC. A date key is a label, not an instant, and must
 * never be round-tripped through a zoned Date.
 */

/** ISO weekday as the string key used in `clinic_settings.opening_hours`. */
export function isoWeekdayKey(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00Z`);
  const day = d.getUTCDay(); // 0 = Sunday
  return String(day === 0 ? 7 : day);
}

export function windowsFor(hours: OpeningHours, dateKey: string): OpeningWindow[] {
  return hours[isoWeekdayKey(dateKey)] ?? [];
}

/** Minutes past midnight for a "HH:mm" string. */
export function minutesOfDay(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Minutes past midnight *in clinic time* for an instant.
 *
 * Use this to position blocks on the grid — never `getHours()` (which uses the
 * viewer's timezone) or `getUTCHours()` (which is 5h30m out for this clinic
 * and would slide every appointment up the grid by that much).
 */
export function minutesOfDayInTz(instant: string | Date, tz = CLINIC_TZ): number {
  return minutesOfDay(formatInTimeZone(instant, tz, "HH:mm"));
}

/**
 * The clinic's earliest open and latest close across a set of days — the
 * vertical extent the calendar grid needs to cover.
 */
export function dayBounds(hours: OpeningHours, dateKeys: string[]) {
  let open = 24 * 60;
  let close = 0;
  for (const key of dateKeys) {
    for (const w of windowsFor(hours, key)) {
      open = Math.min(open, minutesOfDay(w.opens));
      close = Math.max(close, minutesOfDay(w.closes));
    }
  }
  // Nothing open all week — fall back to a sane frame rather than a zero-height grid.
  if (close <= open) return { open: 9 * 60, close: 19 * 60 };
  return { open, close };
}

export function durationMinutes(startsAt: string, endsAt: string) {
  return differenceInMinutes(new Date(endsAt), new Date(startsAt));
}

export { addMinutes, addDays };
