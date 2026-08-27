"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TimeGrid } from "@/components/calendar/time-grid";
import { MonthGrid } from "@/components/calendar/month-grid";
import { AgendaList } from "@/components/calendar/agenda-list";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { AppointmentDrawer } from "@/components/calendar/appointment-drawer";
import { CreateDrawer } from "@/components/calendar/create-drawer";
import { createClient } from "@/lib/supabase/client";
import type {
  AppointmentWithPatient,
  ClinicSettings,
  TreatmentType,
} from "@/lib/supabase/types";
import { clinicToday } from "@/lib/scheduling/time";
import {
  daysFor,
  shift,
  rangeLabel,
  type CalendarView,
  type StatusFilter,
} from "@/lib/scheduling/view";

/**
 * The calendar.
 *
 * View, date and status filter all live in the URL. That is not a stylistic
 * choice — it is the fix for a bug where the arrows moved a local anchor while
 * the server had fetched one specific week, so paging forward drew an empty
 * grid and the realtime refresh kept restoring the original range. One source
 * of truth for "what am I looking at", and the server and the grid cannot
 * disagree about it.
 */
export function CalendarShell({
  initialAppointments,
  settings,
  treatmentTypes,
  view,
  anchor,
  status,
  canManage,
}: {
  initialAppointments: AppointmentWithPatient[];
  settings: ClinicSettings;
  treatmentTypes: TreatmentType[];
  view: CalendarView;
  anchor: string;
  status: StatusFilter;
  canManage: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [selected, setSelected] = useState<AppointmentWithPatient | null>(null);
  const [creating, setCreating] = useState<{ dateKey: string; minutes: number } | null>(
    null
  );
  const [focusedSlot, setFocusedSlot] = useState<{ day: number; minutes: number } | null>(
    null
  );
  const [live, setLive] = useState(false);

  const days = useMemo(() => daysFor(view, anchor), [view, anchor]);

  /*
    Realtime keeps reception honest: an online booking made while the calendar
    is open must appear without anyone thinking to refresh, or a slot gets
    double-promised over the phone.

    The payload carries only changed columns, not the joined patient, so we
    re-fetch through the server rather than patching state from the event. It
    is a cheap request and it keeps one source of truth.
  */
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("appointments-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => router.refresh()
      )
      .subscribe((s) => setLive(s === "SUBSCRIBED"));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const setParams = useCallback(
    (next: Record<string, string>) => {
      const sp = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(next)) sp.set(k, v);
      router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  /**
   * Keeps the selected appointment in step with refreshed server data.
   *
   * The drawer holds an object, not an id. Without this, confirming an
   * appointment would refresh the grid behind a drawer still showing the old
   * status, and the Confirm button would still be sitting there.
   */
  const selectedLive = selected
    ? (initialAppointments.find((a) => a.id === selected.id) ?? selected)
    : null;

  const pendingCount = initialAppointments.filter((a) => a.status === "pending").length;

  const openDay = (dateKey: string) => setParams({ view: "day", date: dateKey });

  return (
    <div>
      <CalendarToolbar
        view={view}
        status={status}
        label={rangeLabel(view, days, anchor)}
        pendingCount={pendingCount}
        live={live}
        canManage={canManage}
        onView={(v) => setParams({ view: v, date: anchor })}
        onStatus={(s) => setParams({ status: s })}
        onShift={(d) => setParams({ date: shift(view, anchor, d) })}
        onToday={() => setParams({ date: clinicToday(settings.timezone) })}
        onCreate={() =>
          setCreating({
            dateKey: days.includes(clinicToday(settings.timezone))
              ? clinicToday(settings.timezone)
              : days[0],
            minutes: 10 * 60,
          })
        }
      />

      {view === "month" ? (
        <MonthGrid
          days={days}
          appointments={initialAppointments}
          settings={settings}
          anchorMonth={anchor}
          onOpenDay={openDay}
          onOpen={setSelected}
        />
      ) : view === "agenda" ? (
        <AgendaList
          days={days}
          appointments={initialAppointments}
          settings={settings}
          onOpen={setSelected}
        />
      ) : (
        <TimeGrid
          days={days}
          appointments={initialAppointments}
          settings={settings}
          focusedSlot={focusedSlot}
          onFocusSlot={setFocusedSlot}
          onCreate={(dateKey, minutes) => setCreating({ dateKey, minutes })}
          onOpen={setSelected}
          canManage={canManage}
        />
      )}

      <AppointmentDrawer
        appointment={selectedLive}
        settings={settings}
        treatmentTypes={treatmentTypes}
        canManage={canManage}
        onClose={() => setSelected(null)}
        onChanged={() => router.refresh()}
        onDone={() => {
          setSelected(null);
          router.refresh();
        }}
      />

      <CreateDrawer
        slot={creating}
        settings={settings}
        treatmentTypes={treatmentTypes}
        onClose={() => setCreating(null)}
        onCreated={() => {
          setCreating(null);
          router.refresh();
        }}
      />
    </div>
  );
}
