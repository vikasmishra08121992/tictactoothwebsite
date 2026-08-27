"use client";

import { Accessibility, Globe, Clock } from "lucide-react";
import type { AppointmentWithPatient } from "@/lib/supabase/types";
import { formatTime, durationMinutes } from "@/lib/scheduling/time";
import { STATUS_BLOCK, STATUS_LABEL } from "@/components/calendar/status";
import { useNow } from "@/lib/hooks/use-now";
import { cn } from "@/lib/utils";

/**
 * One appointment on the grid.
 *
 * Status is never signalled by colour alone — every state carries a border
 * treatment and a text label as well as a hue. See components/calendar/status.
 *
 * The block adapts to the space it has: at 15 minutes there is only room for a
 * name, so everything else is dropped rather than clipped. Truncated text in a
 * dense grid is worse than absent text, because it looks like information.
 */
export function AppointmentBlock({
  appointment,
  style,
  compact = false,
  onOpen,
}: {
  appointment: AppointmentWithPatient;
  style?: React.CSSProperties;
  compact?: boolean;
  onOpen: (a: AppointmentWithPatient) => void;
}) {
  const patient = appointment.patients;
  const mins = durationMinutes(appointment.starts_at, appointment.ends_at);
  const tight = mins <= 20 || (compact && mins <= 30);
  const roomy = mins >= 45 && !compact;

  // `null` until the client clock is available, so the warning is not rendered
  // on the server at a time that will already be stale.
  const now = useNow();
  const expiringSoon =
    appointment.status === "pending" &&
    appointment.expires_at != null &&
    now != null &&
    new Date(appointment.expires_at).getTime() - now < 6 * 3600 * 1000;

  return (
    <button
      type="button"
      style={style}
      onClick={() => onOpen(appointment)}
      aria-label={`${patient?.first_name ?? "Unknown"}, ${formatTime(
        appointment.starts_at
      )}, ${STATUS_LABEL[appointment.status]}`}
      className={cn(
        "absolute z-10 overflow-hidden rounded-lg px-2 py-1 text-left transition-shadow hover:shadow-lift",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
        STATUS_BLOCK[appointment.status]
      )}
    >
      <span className="flex items-center gap-1">
        <span className="truncate text-[13px] font-bold leading-tight">
          {patient?.first_name ?? "Unknown"}
        </span>
        {patient?.accessibility_notes && (
          <Accessibility
            className="size-3.5 shrink-0"
            aria-label="Has accessibility notes"
          />
        )}
        {expiringSoon && (
          <Clock className="size-3.5 shrink-0" aria-label="Expiring soon" />
        )}
      </span>

      {!tight && (
        <span className="mt-0.5 flex items-center gap-1 text-[11px] leading-tight">
          <span className="tabular-nums">{formatTime(appointment.starts_at)}</span>
          {appointment.source === "online" && (
            <Globe className="size-3 shrink-0" aria-label="Booked online" />
          )}
        </span>
      )}

      {roomy && appointment.treatment_types?.name && (
        <span className="mt-0.5 block truncate text-[11px] leading-tight">
          {appointment.treatment_types.name}
        </span>
      )}
    </button>
  );
}
