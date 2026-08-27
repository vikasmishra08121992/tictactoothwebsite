"use client";

import { useMemo } from "react";
import { formatInTimeZone } from "date-fns-tz";
import type { AppointmentWithPatient, ClinicSettings } from "@/lib/supabase/types";
import { toDateKey, clinicToday, windowsFor, formatTime } from "@/lib/scheduling/time";
import { STATUS_DOT } from "@/components/calendar/status";
import { cn } from "@/lib/utils";

/**
 * Month view.
 *
 * Deliberately not a scaled-down week grid. At month scale nobody is reading
 * times — they are answering "which days are heavy" and "when is the clinic
 * closed", so each cell shows a count and the first few appointments, and
 * clicking a day drops into the day view where the times are legible.
 *
 * Closed days are shaded rather than hidden. A receptionist scanning for a
 * free slot needs to see that Sunday is closed, not to find Sunday missing.
 */
export function MonthGrid({
  days,
  appointments,
  settings,
  anchorMonth,
  onOpenDay,
  onOpen,
}: {
  days: string[];
  appointments: AppointmentWithPatient[];
  settings: ClinicSettings;
  anchorMonth: string;
  onOpenDay: (dateKey: string) => void;
  onOpen: (a: AppointmentWithPatient) => void;
}) {
  const today = clinicToday(settings.timezone);
  const month = anchorMonth.slice(0, 7);

  const byDay = useMemo(() => {
    const map = new Map<string, AppointmentWithPatient[]>();
    for (const a of appointments) {
      const key = toDateKey(a.starts_at, settings.timezone);
      const list = map.get(key) ?? [];
      list.push(a);
      map.set(key, list);
    }
    for (const list of map.values()) {
      list.sort((x, y) => x.starts_at.localeCompare(y.starts_at));
    }
    return map;
  }, [appointments, settings.timezone]);

  const weekdayLabels = days.slice(0, 7).map((d) =>
    formatInTimeZone(new Date(`${d}T12:00:00Z`), "UTC", "EEE")
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-[86rem] overflow-hidden rounded-2xl border border-portal-line bg-white">
        <div className="grid grid-cols-7 border-b border-portal-line">
          {weekdayLabels.map((label) => (
            <div
              key={label}
              className="px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-ink/85"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((dateKey) => {
            const list = byDay.get(dateKey) ?? [];
            const closed = windowsFor(settings.opening_hours, dateKey).length === 0;
            const outsideMonth = !dateKey.startsWith(month);
            const isToday = dateKey === today;

            return (
              <div
                key={dateKey}
                className={cn(
                  "min-h-28 border-b border-r border-portal-line p-1.5 last:border-r-0",
                  closed && "bg-ink/[0.05]",
                  outsideMonth && "opacity-55"
                )}
              >
                <button
                  type="button"
                  onClick={() => onOpenDay(dateKey)}
                  aria-label={`Open ${formatInTimeZone(
                    new Date(`${dateKey}T12:00:00Z`),
                    "UTC",
                    "EEEE d MMMM"
                  )}${list.length ? `, ${list.length} appointments` : ", no appointments"}`}
                  className={cn(
                    "flex min-h-8 w-full items-center gap-1.5 rounded-lg px-1.5 text-left text-sm font-bold transition-colors hover:bg-ink/8",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isToday ? "bg-ink text-cream hover:bg-ink/90" : "text-ink"
                  )}
                >
                  {formatInTimeZone(new Date(`${dateKey}T12:00:00Z`), "UTC", "d")}
                  {list.length > 0 && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-1.5 text-[11px]",
                        isToday ? "bg-cream/25" : "bg-ink/10"
                      )}
                    >
                      {list.length}
                    </span>
                  )}
                </button>

                <ul className="mt-1 space-y-0.5">
                  {list.slice(0, 3).map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => onOpen(a)}
                        className="flex w-full items-center gap-1.5 rounded px-1.5 py-0.5 text-left text-[11px] leading-tight text-ink hover:bg-ink/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                      >
                        <span
                          className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[a.status])}
                          aria-hidden="true"
                        />
                        <span className="shrink-0 tabular-nums">
                          {formatTime(a.starts_at, settings.timezone).replace(":00", "")}
                        </span>
                        <span className="truncate font-semibold">
                          {a.patients?.first_name ?? "—"}
                        </span>
                      </button>
                    </li>
                  ))}
                  {list.length > 3 && (
                    <li>
                      <button
                        type="button"
                        onClick={() => onOpenDay(dateKey)}
                        className="w-full rounded px-1.5 text-left text-[11px] font-bold text-ink/85 underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                      >
                        +{list.length - 3} more
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
