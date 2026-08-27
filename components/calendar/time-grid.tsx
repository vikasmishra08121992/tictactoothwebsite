"use client";

import { useMemo, useRef, useEffect, type KeyboardEvent } from "react";
import type {
  AppointmentWithPatient,
  ClinicSettings,
} from "@/lib/supabase/types";
import {
  dayBounds,
  minutesOfDay,
  minutesOfDayInTz,
  toDateKey,
  windowsFor,
  clinicToday,
} from "@/lib/scheduling/time";
import { formatInTimeZone } from "date-fns-tz";
import { AppointmentBlock } from "@/components/calendar/appointment-block";
import { useNow } from "@/lib/hooks/use-now";
import { cn } from "@/lib/utils";

/**
 * The time grid — day and week views are the same component with one column or
 * seven.
 *
 * Built from scratch rather than pulling in a calendar library, as asked.
 * Layout is a CSS grid of day columns; appointments are absolutely positioned
 * within a column by minutes-from-open, in *clinic* time.
 *
 * Keyboard operability is the part most likely to be lost in a dense grid, so
 * it is built in from the start: the empty-slot layer is a roving-tabindex
 * grid — one tab stop for the whole calendar, arrows to move, Enter to book.
 * Tabbing through several hundred individual slots would be unusable.
 *
 * Overlapping appointments are laid out side by side. With one chair they
 * cannot overlap — the exclusion constraint forbids it — but a cancelled
 * appointment and its replacement can share a slot, and a second chair is the
 * likeliest change to this system within a year. Columns cost little now and
 * save a rewrite later.
 */

/**
 * Pixels per minute.
 *
 * Not a free choice: slot height is `slot_minutes × density`, and that height
 * is a touch target. At the previous 1.4 a 15-minute slot was 21px, under the
 * 24px WCAG 2.2 AA minimum (2.5.8). 1.7 puts it at 25.5px with the seeded
 * 15-minute grid, and a clinic on a coarser grid only gets more room.
 *
 * It cannot reach 44px — the grid is a map of time, so making a slot 44px tall
 * would stretch a nine-hour day past 1500px. The 44px path is the keyboard
 * (arrows plus Enter) and the "New appointment" button, which is what 2.5.8's
 * equivalent-control exception is for.
 */
const DENSITY = { day: 2.1, week: 1.7 } as const;

type Positioned = {
  appointment: AppointmentWithPatient;
  startMins: number;
  endMins: number;
  column: number;
  columns: number;
};

/**
 * Assigns overlapping appointments to side-by-side columns.
 *
 * Sweeps in start order, keeping a cluster of everything that overlaps; each
 * appointment takes the first column free at its start time, and the whole
 * cluster is then drawn at the cluster's column count so widths line up.
 */
function layout(items: { a: AppointmentWithPatient; s: number; e: number }[]): Positioned[] {
  const sorted = [...items].sort((x, y) => x.s - y.s || y.e - x.e);
  const out: Positioned[] = [];
  let cluster: Positioned[] = [];
  let clusterEnd = -1;

  const flush = () => {
    const width = cluster.reduce((m, c) => Math.max(m, c.column + 1), 1);
    for (const c of cluster) out.push({ ...c, columns: width });
    cluster = [];
    clusterEnd = -1;
  };

  for (const { a, s, e } of sorted) {
    if (s >= clusterEnd && cluster.length > 0) flush();

    const taken = new Set(cluster.filter((c) => c.endMins > s).map((c) => c.column));
    let column = 0;
    while (taken.has(column)) column++;

    cluster.push({ appointment: a, startMins: s, endMins: e, column, columns: 1 });
    clusterEnd = Math.max(clusterEnd, e);
  }
  if (cluster.length > 0) flush();

  return out;
}

export function TimeGrid({
  days,
  appointments,
  settings,
  focusedSlot,
  onFocusSlot,
  onCreate,
  onOpen,
  canManage,
}: {
  days: string[];
  appointments: AppointmentWithPatient[];
  settings: ClinicSettings;
  focusedSlot: { day: number; minutes: number } | null;
  onFocusSlot: (s: { day: number; minutes: number }) => void;
  onCreate: (dateKey: string, minutes: number) => void;
  onOpen: (a: AppointmentWithPatient) => void;
  canManage: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = clinicToday(settings.timezone);
  const isDay = days.length === 1;
  const pxPerMin = isDay ? DENSITY.day : DENSITY.week;

  const { open, close } = useMemo(
    () => dayBounds(settings.opening_hours, days),
    [settings.opening_hours, days]
  );

  const height = (close - open) * pxPerMin;
  const step = settings.slot_minutes;

  const hourLines = useMemo(() => {
    const lines: number[] = [];
    for (let m = Math.ceil(open / 60) * 60; m < close; m += 60) lines.push(m);
    return lines;
  }, [open, close]);

  const byDay = useMemo(() => {
    const map = new Map<string, Positioned[]>();
    const raw = new Map<string, { a: AppointmentWithPatient; s: number; e: number }[]>();

    for (const a of appointments) {
      const key = toDateKey(a.starts_at, settings.timezone);
      const list = raw.get(key) ?? [];
      list.push({
        a,
        // Clinic-local minutes — never getHours() (the viewer's zone) or
        // getUTCHours() (5h30m out here, sliding every block up the grid).
        s: minutesOfDayInTz(a.starts_at, settings.timezone),
        e: minutesOfDayInTz(a.ends_at, settings.timezone),
      });
      raw.set(key, list);
    }
    for (const [key, list] of raw) map.set(key, layout(list));
    return map;
  }, [appointments, settings.timezone]);

  // Current time, for the "now" line. Null on the server so the line simply is
  // not rendered rather than being drawn at a stale time.
  const now = useNow(60_000);
  const nowMinutes =
    now == null ? null : minutesOfDayInTz(new Date(now), settings.timezone);
  const showNow =
    nowMinutes != null &&
    nowMinutes >= open &&
    nowMinutes <= close &&
    days.includes(today);

  // Scroll the working day into view on mount rather than starting at the top
  // of an early opening hour nobody books.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const target = nowMinutes != null && showNow ? nowMinutes - 90 : open;
    el.scrollTop = Math.max(0, (target - open) * pxPerMin);
    // Only on mount and when the frame itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days.join(","), open]);

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    if (!focusedSlot) return;
    const { day, minutes } = focusedSlot;
    let next = focusedSlot;

    switch (e.key) {
      case "ArrowRight":
        next = { day: Math.min(days.length - 1, day + 1), minutes };
        break;
      case "ArrowLeft":
        next = { day: Math.max(0, day - 1), minutes };
        break;
      case "ArrowDown":
        next = { day, minutes: Math.min(close - step, minutes + step) };
        break;
      case "ArrowUp":
        next = { day, minutes: Math.max(open, minutes - step) };
        break;
      case "Home":
        next = { day, minutes: open };
        break;
      case "End":
        next = { day, minutes: close - step };
        break;
      case "Enter":
      case " ":
        if (!canManage) return;
        e.preventDefault();
        onCreate(days[day], minutes);
        return;
      default:
        return;
    }
    e.preventDefault();
    onFocusSlot(next);

    // Move real focus, so assistive tech follows the arrow keys.
    requestAnimationFrame(() => {
      scrollRef.current
        ?.querySelector<HTMLButtonElement>(
          `[data-slot-day="${next.day}"][data-slot-min="${next.minutes}"]`
        )
        ?.focus();
    });
  }

  const columnTemplate = isDay
    ? "grid-cols-[4.5rem_1fr]"
    : "grid-cols-[4.5rem_repeat(7,minmax(7rem,1fr))]";

  return (
    <div className="px-0 md:px-8 md:py-6">
      <div className="mx-auto max-w-[86rem] overflow-hidden border-y border-portal-line bg-white md:rounded-2xl md:border">
        <div className="overflow-x-auto">
          <div className={isDay ? "min-w-0" : "min-w-[52rem]"}>
            {/* day headers */}
            <div
              className={cn(
                "sticky top-0 z-20 grid border-b border-portal-line bg-white",
                columnTemplate
              )}
            >
              <div />
              {days.map((d) => {
                const closed = windowsFor(settings.opening_hours, d).length === 0;
                return (
                  <div
                    key={d}
                    className={cn(
                      "px-2 py-2.5 text-center text-sm font-bold",
                      d === today ? "bg-gold/30 text-ink" : "text-ink/85"
                    )}
                  >
                    {formatInTimeZone(
                      new Date(`${d}T12:00:00Z`),
                      "UTC",
                      isDay ? "EEEE d MMMM" : "EEE d"
                    )}
                    {d === today && (
                      <span className="ml-1.5 rounded-full bg-ink px-2 py-0.5 text-[10px] uppercase text-cream">
                        Today
                      </span>
                    )}
                    {closed && (
                      <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-ink/85">
                        Closed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              ref={scrollRef}
              className="max-h-[calc(100vh-15rem)] overflow-y-auto"
            >
              {/*
                Not an ARIA grid.

                It was, and the roles were invalid: `role="row"` requires
                `gridcell` children, and a column of absolutely positioned
                blocks cannot honestly provide them. Faking the structure to
                satisfy the pattern would announce a table that does not exist.

                What it is instead is a set of real buttons with real labels,
                navigated by a roving tabindex — one tab stop for the whole
                calendar, arrows to move, Enter to book. Focus moves to the
                actual button, so a screen reader reads the slot it is on
                rather than a container's description of it.
              */}
              <div
                aria-label="Appointment calendar. Use arrow keys to move between slots and Enter to create an appointment."
                onKeyDown={handleKey}
                className={cn("relative grid", columnTemplate)}
                style={{ height }}
              >
                {/* hour gutter */}
                <div className="relative border-r border-portal-line">
                  {hourLines.map((m) => (
                    <div
                      key={m}
                      className="absolute right-2 -translate-y-1/2 text-[11px] font-semibold tabular-nums text-ink/85"
                      style={{ top: (m - open) * pxPerMin }}
                    >
                      {String(Math.floor(m / 60) % 12 || 12)}
                      {m / 60 >= 12 ? "pm" : "am"}
                    </div>
                  ))}
                </div>

                {days.map((dateKey, dayIndex) => {
                  const windows = windowsFor(settings.opening_hours, dateKey);
                  const dayAppts = byDay.get(dateKey) ?? [];

                  return (
                    <div
                      key={dateKey}
                      className="relative border-r border-portal-line last:border-r-0"
                    >
                      {/* Closed is the default: the whole column is shaded and
                          open windows paint white over it, so a missing window
                          can never read as "open". */}
                      <div
                        className="absolute inset-0 bg-ink/[0.05]"
                        aria-hidden="true"
                      />
                      {windows.map((w, i) => (
                        <div
                          key={i}
                          className="absolute inset-x-0 bg-white"
                          aria-hidden="true"
                          style={{
                            top: (minutesOfDay(w.opens) - open) * pxPerMin,
                            height:
                              (minutesOfDay(w.closes) - minutesOfDay(w.opens)) *
                              pxPerMin,
                          }}
                        />
                      ))}

                      {hourLines.map((m) => (
                        <div
                          key={m}
                          className="absolute inset-x-0 border-t border-ink/10"
                          aria-hidden="true"
                          style={{ top: (m - open) * pxPerMin }}
                        />
                      ))}

                      {/* clickable empty slots */}
                      {canManage &&
                        windows.flatMap((w) => {
                          const from = minutesOfDay(w.opens);
                          const to = minutesOfDay(w.closes);
                          const cells = [];
                          for (let m = from; m < to; m += step) {
                            const isFocused =
                              focusedSlot?.day === dayIndex &&
                              focusedSlot?.minutes === m;
                            cells.push(
                              <button
                                key={m}
                                type="button"
                                data-slot-day={dayIndex}
                                data-slot-min={m}
                                // Exactly one slot is tabbable: the focused
                                // one, or the first if nothing is focused yet.
                                tabIndex={
                                  isFocused ||
                                  (focusedSlot === null && dayIndex === 0 && m === from)
                                    ? 0
                                    : -1
                                }
                                aria-label={`Create appointment, ${dateKey} at ${String(
                                  Math.floor(m / 60)
                                ).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`}
                                onFocus={() => onFocusSlot({ day: dayIndex, minutes: m })}
                                onClick={() => {
                                  onFocusSlot({ day: dayIndex, minutes: m });
                                  onCreate(dateKey, m);
                                }}
                                className={cn(
                                  "absolute inset-x-0 transition-colors hover:bg-mint/30",
                                  isFocused && "bg-mint/40 ring-2 ring-inset ring-ring"
                                )}
                                style={{
                                  top: (m - open) * pxPerMin,
                                  height: step * pxPerMin,
                                }}
                              />
                            );
                          }
                          return cells;
                        })}

                      {dayAppts.map((p) => (
                        <AppointmentBlock
                          key={p.appointment.id}
                          appointment={p.appointment}
                          compact={!isDay}
                          onOpen={onOpen}
                          style={{
                            top: (p.startMins - open) * pxPerMin,
                            height: Math.max(
                              26,
                              (p.endMins - p.startMins) * pxPerMin - 2
                            ),
                            left: `calc(${(p.column / p.columns) * 100}% + 2px)`,
                            width: `calc(${100 / p.columns}% - 4px)`,
                          }}
                        />
                      ))}

                      {/* now line */}
                      {showNow && dateKey === today && (
                        <div
                          className="pointer-events-none absolute inset-x-0 z-20 border-t-2 border-crimson-btn"
                          aria-hidden="true"
                          style={{ top: (nowMinutes! - open) * pxPerMin }}
                        >
                          <span className="absolute -left-1 -top-1 size-2 rounded-full bg-crimson-btn" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
