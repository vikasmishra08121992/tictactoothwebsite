import { formatInTimeZone } from "date-fns-tz";
import type { AppointmentStatus } from "@/lib/supabase/types";

/**
 * Calendar view state, derived from the URL.
 *
 * This lives in the URL rather than in component state, and that is the fix
 * for a real bug: the week arrows used to move a `useState` anchor while the
 * server had already fetched appointments for one specific week. Moving to the
 * next week redrew an empty grid — the days changed, the data did not — and
 * `router.refresh()` from the realtime subscription refetched the *original*
 * week, so it never self-corrected.
 *
 * Keeping it in the URL also makes a view shareable and survivable: reception
 * can send "the 3rd looks busy" as a link, and a refresh lands on the same day
 * rather than snapping back to today.
 */

export type CalendarView = "day" | "week" | "month" | "agenda";

export const VIEWS: { id: CalendarView; label: string; short: string }[] = [
  { id: "day", label: "Day", short: "D" },
  { id: "week", label: "Week", short: "W" },
  { id: "month", label: "Month", short: "M" },
  { id: "agenda", label: "List", short: "L" },
];

export type StatusFilter = "all" | "active" | AppointmentStatus;

export const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "active", label: "Pending & confirmed" },
  { id: "pending", label: "Pending only" },
  { id: "confirmed", label: "Confirmed only" },
  { id: "cancelled", label: "Cancelled" },
  { id: "no_show", label: "No-shows" },
];

export function parseView(value: unknown): CalendarView {
  return VIEWS.some((v) => v.id === value) ? (value as CalendarView) : "week";
}

export function parseStatus(value: unknown): StatusFilter {
  return STATUS_FILTERS.some((s) => s.id === value)
    ? (value as StatusFilter)
    : "all";
}

/**
 * All of the arithmetic below is UTC-only, deliberately.
 *
 * date-fns's startOfWeek/startOfMonth work in the *runtime's* local zone. On
 * a machine set to IST, `startOfWeek` of noon-UTC Tuesday returned local
 * Monday 00:00 — which is 18:30 UTC on Sunday — and formatting that back as a
 * UTC date key produced Sunday. The calendar opened on the wrong week, off by
 * one day, and only in zones east of UTC. A date key is a label, not an
 * instant; it must never be round-tripped through a zoned Date.
 */
const key = (d: Date) => formatInTimeZone(d, "UTC", "yyyy-MM-dd");

/** Midday avoids any chance of a date key rounding across a boundary. */
const at = (dateKey: string) => new Date(`${dateKey}T12:00:00Z`);

const addUtcDays = (d: Date, n: number) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n, 12));

/** Monday-first, computed in UTC. */
const startOfUtcWeek = (d: Date) => {
  const dow = d.getUTCDay(); // 0 = Sunday
  return addUtcDays(d, -((dow + 6) % 7));
};

const startOfUtcMonth = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 12));

const endOfUtcMonth = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 12));

/**
 * The day columns a view shows.
 *
 * Agenda covers a fortnight from the anchor — long enough to answer "what is
 * coming up" without paging, short enough not to become a data dump of every
 * child's name in the system.
 */
export function daysFor(view: CalendarView, anchor: string): string[] {
  switch (view) {
    case "day":
      return [anchor];

    case "week": {
      const monday = startOfUtcWeek(at(anchor));
      return Array.from({ length: 7 }, (_, i) => key(addUtcDays(monday, i)));
    }

    case "month": {
      // A month grid always shows whole weeks, so it runs from the Monday on or
      // before the 1st to the Sunday on or after the last day.
      const first = startOfUtcMonth(at(anchor));
      const gridStart = startOfUtcWeek(first);
      const last = endOfUtcMonth(at(anchor));
      const cells: string[] = [];
      let cursor = gridStart;
      while (cursor <= last || cells.length % 7 !== 0) {
        cells.push(key(cursor));
        cursor = addUtcDays(cursor, 1);
        if (cells.length > 42) break; // six weeks is the maximum any month spans
      }
      return cells;
    }

    case "agenda":
      return Array.from({ length: 14 }, (_, i) => key(addUtcDays(at(anchor), i)));
  }
}

/** How far one arrow press moves, in days, for each view. */
export function stepFor(view: CalendarView): number {
  return view === "day" ? 1 : view === "week" ? 7 : view === "agenda" ? 14 : 0;
}

/** Moves the anchor forward or back one page of the current view. */
export function shift(view: CalendarView, anchor: string, delta: number): string {
  if (view === "month") {
    const d = at(anchor);
    return key(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1, 12)));
  }
  return key(addUtcDays(at(anchor), stepFor(view) * delta));
}

/**
 * Human label for the current range, shown in the toolbar.
 *
 * Month takes its name from the anchor, not from the first cell. A month grid
 * starts on the Monday on or before the 1st, so August 2026 opens on 27 July —
 * labelling it from `days[0]` called it "July 2026" while showing August.
 */
export function rangeLabel(
  view: CalendarView,
  days: string[],
  anchor: string
): string {
  if (days.length === 0) return "";
  const first = at(days[0]);
  const last = at(days[days.length - 1]);

  if (view === "day") return formatInTimeZone(first, "UTC", "EEEE d MMMM yyyy");
  if (view === "month") return formatInTimeZone(at(anchor), "UTC", "MMMM yyyy");

  const sameMonth =
    formatInTimeZone(first, "UTC", "MMM yyyy") ===
    formatInTimeZone(last, "UTC", "MMM yyyy");

  return sameMonth
    ? `${formatInTimeZone(first, "UTC", "d")} – ${formatInTimeZone(last, "UTC", "d MMM yyyy")}`
    : `${formatInTimeZone(first, "UTC", "d MMM")} – ${formatInTimeZone(last, "UTC", "d MMM yyyy")}`;
}

/** Statuses a filter admits, or null for "no filter". */
export function statusesFor(filter: StatusFilter): AppointmentStatus[] | null {
  if (filter === "all") return null;
  if (filter === "active") return ["pending", "confirmed"];
  return [filter];
}
