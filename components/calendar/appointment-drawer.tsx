"use client";

import { useState, useTransition } from "react";
import {
  Check,
  X,
  Phone,
  Accessibility,
  Clock,
  User,
  CalendarX,
  CalendarClock,
  Globe,
  MessageCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AppointmentWithPatient,
  ClinicSettings,
  TreatmentType,
} from "@/lib/supabase/types";
import { formatTime, formatDate, toDateKey, durationMinutes } from "@/lib/scheduling/time";
import { STATUS_LABEL, STATUS_PILL } from "@/components/calendar/status";
import { useNow } from "@/lib/hooks/use-now";
import {
  confirmAppointment,
  cancelAppointment,
  setAppointmentStatus,
  updateStaffNotes,
  rescheduleAppointment,
} from "@/lib/scheduling/actions";
import { cn } from "@/lib/utils";

/** "in 3 hours" / "2 hours ago" — enough precision for a pending countdown. */
function relative(target: string, now: number): string {
  const diff = new Date(target).getTime() - now;
  const mins = Math.round(Math.abs(diff) / 60000);
  const text =
    mins < 60
      ? `${mins} min`
      : mins < 60 * 24
        ? `${Math.round(mins / 60)} hr`
        : `${Math.round(mins / (60 * 24))} days`;
  return diff >= 0 ? `in ${text}` : `${text} ago`;
}

export function AppointmentDrawer({
  appointment,
  settings,
  treatmentTypes,
  canManage,
  onClose,
  onChanged,
  onDone,
}: {
  appointment: AppointmentWithPatient | null;
  settings: ClinicSettings;
  treatmentTypes: TreatmentType[];
  canManage: boolean;
  onClose: () => void;
  /** Refresh, keeping the drawer open — for edits made in place. */
  onChanged: () => void;
  /** Refresh and close — for actions that end the conversation. */
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [mode, setMode] = useState<"view" | "cancel" | "reschedule">("view");
  const now = useNow();

  if (!appointment) return null;

  const patient = appointment.patients;
  const family = patient?.families;
  const duration = durationMinutes(appointment.starts_at, appointment.ends_at);

  function run(
    fn: () => Promise<{ ok: boolean; error?: string }>,
    after: () => void
  ) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      else {
        setMode("view");
        after();
      }
    });
  }

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto bg-portal sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="flex flex-wrap items-center gap-2 text-2xl font-bold text-ink">
            {patient?.first_name ?? "Appointment"}
            {appointment.age_at_booking != null && (
              <span className="font-normal text-ink/85">
                · {appointment.age_at_booking}
              </span>
            )}
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                STATUS_PILL[appointment.status]
              )}
            >
              {STATUS_LABEL[appointment.status]}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-8">
          <div className="rounded-2xl bg-white p-4 shadow-soft">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Clock className="size-4 shrink-0 text-teal-text" aria-hidden="true" />
              {formatDate(appointment.starts_at, settings.timezone)} ·{" "}
              {formatTime(appointment.starts_at, settings.timezone)} –{" "}
              {formatTime(appointment.ends_at, settings.timezone)}
            </p>
            <p className="mt-1.5 text-sm text-ink/85">
              {appointment.treatment_types?.name ?? "—"} · {duration} min ·{" "}
              <span className="font-mono">{appointment.reference}</span>
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink/85">
              {appointment.source === "online" && (
                <Globe className="size-3.5" aria-hidden="true" />
              )}
              Booked {appointment.source === "online" ? "online" : "by staff"}
              {appointment.room_preference !== "no_preference" &&
                ` · prefers the ${appointment.room_preference} room`}
            </p>

            {appointment.status === "pending" && appointment.expires_at && now && (
              <p className="mt-3 rounded-lg border-2 border-dashed border-gold bg-gold/25 px-3 py-2 text-xs leading-relaxed text-ink">
                This request is holding the slot and expires{" "}
                <strong>{relative(appointment.expires_at, now)}</strong>. Confirm
                it or the time is released automatically.
              </p>
            )}
          </div>

          {patient?.accessibility_notes && (
            <div className="rounded-2xl border-2 border-midnight bg-lavender/50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Accessibility className="size-4" aria-hidden="true" />
                What would help this child
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/85">
                {patient.accessibility_notes}
              </p>
            </div>
          )}

          {family && (
            <div className="rounded-2xl bg-white p-4 shadow-soft">
              <p className="flex items-center gap-2 font-semibold text-ink">
                <User className="size-4 shrink-0 text-teal-text" aria-hidden="true" />
                {family.contact_name}
                <span className="font-normal text-ink/85">
                  ({family.relationship})
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={`tel:${family.mobile}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {family.mobile}
                </a>
                <a
                  href={`https://wa.me/91${family.mobile.replace(/\D/g, "").slice(-10)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-leaf-text px-4 text-sm font-semibold text-leaf-text transition-colors hover:bg-leaf-text hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
              {family.is_provisional && (
                <p className="mt-3 rounded-lg bg-gold/25 px-3 py-2 text-xs leading-relaxed text-ink">
                  Booked online, so this family record was created fresh. If they
                  are an existing patient, merge the records from Records —
                  never rely on the phone number matching by itself.
                </p>
              )}
            </div>
          )}

          {appointment.concern && (
            <div className="rounded-2xl bg-white p-4 shadow-soft">
              <p className="text-sm font-bold text-ink">Reason given</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/85">
                {appointment.concern}
              </p>
            </div>
          )}

          {appointment.status === "cancelled" && appointment.cancel_reason && (
            <div className="rounded-2xl border-2 border-crimson-btn bg-white p-4">
              <p className="text-sm font-bold text-crimson-text">Cancelled</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/85">
                {appointment.cancel_reason}
              </p>
            </div>
          )}

          {canManage && (
            <div className="rounded-2xl bg-white p-4 shadow-soft">
              <Label htmlFor="staff-notes">Staff notes</Label>
              <Textarea
                id="staff-notes"
                rows={3}
                value={notes ?? appointment.staff_notes ?? ""}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5"
              />
              <Button
                variant="outline"
                className="mt-2 h-11 rounded-full"
                disabled={pending || notes === null}
                onClick={() =>
                  run(() => updateStaffNotes(appointment.id, notes ?? ""), () => {
                    setNotes(null);
                    onChanged();
                  })
                }
              >
                Save notes
              </Button>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-crimson/15 p-3 text-sm font-semibold text-crimson-text"
            >
              {error}
            </p>
          )}

          {canManage && mode === "reschedule" && (
            <ReschedulePanel
              appointment={appointment}
              settings={settings}
              treatmentTypes={treatmentTypes}
              pending={pending}
              onCancel={() => setMode("view")}
              onSubmit={(startISO, endISO) =>
                run(
                  () => rescheduleAppointment(appointment.id, startISO, endISO),
                  onDone
                )
              }
            />
          )}

          {canManage && mode === "cancel" && (
            <div className="rounded-2xl border-2 border-crimson-btn bg-white p-4">
              <Label htmlFor="cancel-reason">Why is this being cancelled?</Label>
              <p className="mt-1 text-xs leading-relaxed text-ink/85">
                Stored on the record and included in the message to the parent,
                so write it for them to read.
              </p>
              <Textarea
                id="cancel-reason"
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-1.5"
              />
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-full"
                  onClick={() => setMode("view")}
                >
                  Keep it
                </Button>
                <Button
                  className="h-11 flex-1 rounded-full bg-crimson-btn text-white hover:bg-crimson-btn/90"
                  disabled={pending || !cancelReason.trim()}
                  onClick={() =>
                    run(
                      () => cancelAppointment(appointment.id, cancelReason.trim()),
                      onDone
                    )
                  }
                >
                  Cancel it
                </Button>
              </div>
            </div>
          )}

          {canManage && mode === "view" && (
            <div className="space-y-2 border-t border-ink/15 pt-5">
              {appointment.status === "pending" && (
                <Button
                  className="h-12 w-full rounded-full text-base"
                  disabled={pending}
                  onClick={() =>
                    run(() => confirmAppointment(appointment.id), onDone)
                  }
                >
                  <Check className="size-5" aria-hidden="true" />
                  Confirm this appointment
                </Button>
              )}

              {appointment.status === "confirmed" && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-11 rounded-full"
                    disabled={pending}
                    onClick={() =>
                      run(
                        () => setAppointmentStatus(appointment.id, "completed"),
                        onDone
                      )
                    }
                  >
                    <Check className="size-4" aria-hidden="true" />
                    Attended
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 rounded-full"
                    disabled={pending}
                    onClick={() =>
                      run(
                        () => setAppointmentStatus(appointment.id, "no_show"),
                        onDone
                      )
                    }
                  >
                    <CalendarX className="size-4" aria-hidden="true" />
                    No-show
                  </Button>
                </div>
              )}

              {appointment.status !== "cancelled" &&
                appointment.status !== "completed" && (
                  <>
                    <Button
                      variant="outline"
                      className="h-11 w-full rounded-full"
                      disabled={pending}
                      onClick={() => setMode("reschedule")}
                    >
                      <CalendarClock className="size-4" aria-hidden="true" />
                      Move to another time
                    </Button>

                    <Button
                      variant="outline"
                      className="h-11 w-full rounded-full border-2 border-crimson-btn text-crimson-text hover:bg-crimson-btn hover:text-white"
                      disabled={pending}
                      onClick={() => setMode("cancel")}
                    >
                      <X className="size-4" aria-hidden="true" />
                      Cancel appointment
                    </Button>
                  </>
                )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Reschedule.
 *
 * Staff pick a date and time directly rather than choosing from the public
 * availability list. That is deliberate: reception routinely needs to squeeze
 * someone in outside the normal grid, and a tool that refuses is a tool people
 * work around with a paper diary. The database still has the final say — the
 * exclusion constraint rejects a genuine double-booking and the error comes
 * back as "that slot was taken".
 */
function ReschedulePanel({
  appointment,
  settings,
  treatmentTypes,
  pending,
  onCancel,
  onSubmit,
}: {
  appointment: AppointmentWithPatient;
  settings: ClinicSettings;
  treatmentTypes: TreatmentType[];
  pending: boolean;
  onCancel: () => void;
  onSubmit: (startISO: string, endISO: string) => void;
}) {
  const currentDuration = durationMinutes(
    appointment.starts_at,
    appointment.ends_at
  );

  const [date, setDate] = useState(
    toDateKey(appointment.starts_at, settings.timezone)
  );
  const [time, setTime] = useState(
    formatTime(appointment.starts_at, settings.timezone)
      .replace(/\s?[ap]m/i, "")
      .padStart(5, "0")
  );
  const [minutes, setMinutes] = useState(String(currentDuration));

  // The clinic runs on a fixed offset (India observes no DST), so a wall-clock
  // time on a date maps to exactly one instant. This would be a bug in a market
  // that changes its clocks.
  const toInstant = (dateKey: string, hhmm: string, addMins = 0) => {
    const [h, m] = hhmm.split(":").map(Number);
    const base = new Date(`${dateKey}T00:00:00+05:30`);
    base.setMinutes(base.getMinutes() + h * 60 + m + addMins);
    return base.toISOString();
  };

  const durationOptions = [...new Set([currentDuration, 15, 30, 45, 60, 90])].sort(
    (a, b) => a - b
  );

  const valid = /^\d{1,2}:\d{2}$/.test(time) && !!date;

  return (
    <div className="rounded-2xl border-2 border-ink bg-white p-4">
      <p className="font-display text-base font-bold text-ink">
        Move this appointment
      </p>
      <p className="mt-1 text-xs leading-relaxed text-ink/85">
        The parent is told automatically. If the new time clashes with another
        booking the database will refuse it.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="rs-date">Date</Label>
          <Input
            id="rs-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="rs-time">Start time (24h)</Label>
          <Input
            id="rs-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="mt-3">
        <Label htmlFor="rs-duration">Length</Label>
        <Select
          value={minutes}
          onValueChange={(v) => setMinutes(v ?? String(currentDuration))}
          items={Object.fromEntries(
            durationOptions.map((m) => [
              String(m),
              `${m} minutes${m === currentDuration ? " (unchanged)" : ""}`,
            ])
          )}
        >
          <SelectTrigger id="rs-duration" className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((m) => (
              <SelectItem key={m} value={String(m)}>
                {m} minutes
                {m === currentDuration ? " (unchanged)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {treatmentTypes.length > 0 && (
          <p className="mt-1 text-xs text-ink/85">
            {appointment.treatment_types?.name ?? "This treatment"} is normally{" "}
            {treatmentTypes.find((t) => t.id === appointment.treatment_type_id)
              ?.duration_minutes ?? currentDuration}{" "}
            minutes.
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          className="h-11 flex-1 rounded-full"
          onClick={onCancel}
        >
          Back
        </Button>
        <Button
          className="h-11 flex-1 rounded-full"
          disabled={pending || !valid}
          onClick={() =>
            onSubmit(
              toInstant(date, time),
              toInstant(date, time, Number(minutes))
            )
          }
        >
          {pending ? "Moving…" : "Move it"}
        </Button>
      </div>
    </div>
  );
}
