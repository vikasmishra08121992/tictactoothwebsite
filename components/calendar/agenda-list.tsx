"use client";

import { useMemo } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Phone, Accessibility, Globe } from "lucide-react";
import type { AppointmentWithPatient, ClinicSettings } from "@/lib/supabase/types";
import { toDateKey, clinicToday, formatTime } from "@/lib/scheduling/time";
import { STATUS_LABEL, STATUS_PILL } from "@/components/calendar/status";
import { cn } from "@/lib/utils";

/**
 * The list view.
 *
 * The time grid is the wrong tool on a phone — a week of columns at a legible
 * density is wider than any handset, and reception often works from a phone
 * while away from the desk. It is also the better view for working through a
 * backlog of pending requests, where the question is "who do I need to call"
 * rather than "what does Tuesday look like".
 *
 * Empty days are dropped rather than shown as blanks: a fortnight of headers
 * with nothing under them is noise.
 */
export function AgendaList({
  days,
  appointments,
  settings,
  onOpen,
}: {
  days: string[];
  appointments: AppointmentWithPatient[];
  settings: ClinicSettings;
  onOpen: (a: AppointmentWithPatient) => void;
}) {
  const today = clinicToday(settings.timezone);

  const grouped = useMemo(() => {
    const map = new Map<string, AppointmentWithPatient[]>();
    for (const a of appointments) {
      const key = toDateKey(a.starts_at, settings.timezone);
      if (!days.includes(key)) continue;
      const list = map.get(key) ?? [];
      list.push(a);
      map.set(key, list);
    }
    return days
      .filter((d) => map.has(d))
      .map((d) => ({
        dateKey: d,
        items: map.get(d)!.sort((x, y) => x.starts_at.localeCompare(y.starts_at)),
      }));
  }, [appointments, days, settings.timezone]);

  if (grouped.length === 0) {
    return (
      <div className="mx-auto max-w-[86rem] px-4 py-16 text-center md:px-8">
        <p className="text-lg font-semibold text-ink">Nothing in this period.</p>
        <p className="mt-2 text-sm text-ink/85">
          Try a different date range, or widen the status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[86rem] space-y-8 px-4 py-6 md:px-8">
      {grouped.map(({ dateKey, items }) => (
        <section key={dateKey}>
          <h3 className="sticky top-[4.5rem] z-10 -mx-1 bg-portal px-1 py-1.5 font-display text-sm font-bold text-ink">
            {formatInTimeZone(
              new Date(`${dateKey}T12:00:00Z`),
              "UTC",
              "EEEE d MMMM"
            )}
            {dateKey === today && (
              <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[10px] uppercase text-cream">
                Today
              </span>
            )}
            <span className="ml-2 font-normal text-ink/85">
              {items.length} {items.length === 1 ? "appointment" : "appointments"}
            </span>
          </h3>

          <ul className="mt-2 space-y-2">
            {items.map((a) => {
              const family = a.patients?.families;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(a)}
                    className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-portal-line bg-white p-4 text-left transition-shadow hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="w-24 shrink-0 font-display text-base font-bold tabular-nums text-ink">
                      {formatTime(a.starts_at, settings.timezone)}
                    </span>

                    <span className="min-w-40 flex-1">
                      <span className="flex items-center gap-2 font-semibold text-ink">
                        {a.patients?.first_name ?? "Unknown"}
                        {a.age_at_booking != null && (
                          <span className="font-normal text-ink/85">
                            · {a.age_at_booking}
                          </span>
                        )}
                        {a.patients?.accessibility_notes && (
                          <Accessibility
                            className="size-4 text-midnight"
                            aria-label="Has accessibility notes"
                          />
                        )}
                        {a.source === "online" && (
                          <Globe
                            className="size-3.5 text-ink/85"
                            aria-label="Booked online"
                          />
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink/85">
                        {a.treatment_types?.name ?? "—"}
                      </span>
                    </span>

                    {family && (
                      <span className="flex items-center gap-1.5 text-sm text-ink/85">
                        <Phone className="size-4 text-teal-text" aria-hidden="true" />
                        {family.mobile}
                      </span>
                    )}

                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-bold",
                        STATUS_PILL[a.status]
                      )}
                    >
                      {STATUS_LABEL[a.status]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
