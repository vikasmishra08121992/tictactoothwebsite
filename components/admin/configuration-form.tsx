"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClinicSettings, OpeningHours, OpeningWindow } from "@/lib/supabase/types";
import { updateSettings } from "@/lib/admin/actions";

const WEEKDAYS = [
  ["1", "Monday"],
  ["2", "Tuesday"],
  ["3", "Wednesday"],
  ["4", "Thursday"],
  ["5", "Friday"],
  ["6", "Saturday"],
  ["7", "Sunday"],
] as const;

function Field({
  id,
  label,
  hint,
  ...props
}: React.ComponentProps<typeof Input> & { label: string; hint?: string; id: string }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className="mt-1.5 bg-white" {...props} />
      {hint && <p className="mt-1 text-xs leading-relaxed text-ink/85">{hint}</p>}
    </div>
  );
}

export function ConfigurationForm({ settings }: { settings: ClinicSettings }) {
  const [pending, startTransition] = useTransition();
  const [hours, setHours] = useState<OpeningHours>(settings.opening_hours ?? {});

  function setWindow(day: string, index: number, patch: Partial<OpeningWindow>) {
    setHours((h) => {
      const list = [...(h[day] ?? [])];
      list[index] = { ...list[index], ...patch };
      return { ...h, [day]: list };
    });
  }

  function addWindow(day: string) {
    setHours((h) => ({
      ...h,
      [day]: [...(h[day] ?? []), { opens: "10:00", closes: "13:00" }],
    }));
  }

  function removeWindow(day: string, index: number) {
    setHours((h) => ({
      ...h,
      [day]: (h[day] ?? []).filter((_, i) => i !== index),
    }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const num = (k: string) => Number(f.get(k));

    startTransition(async () => {
      const res = await updateSettings({
        slot_minutes: num("slot_minutes"),
        buffer_minutes: num("buffer_minutes"),
        booking_lead_hours: num("booking_lead_hours"),
        booking_horizon_days: num("booking_horizon_days"),
        pending_ttl_hours: num("pending_ttl_hours"),
        max_pending_per_mobile: num("max_pending_per_mobile"),
        max_requests_per_ip_hr: num("max_requests_per_ip_hr"),
        retention_months: num("retention_months"),
        phone_display: String(f.get("phone_display") ?? ""),
        phone_href: String(f.get("phone_href") ?? ""),
        whatsapp_href: String(f.get("whatsapp_href") ?? ""),
        timings_display: String(f.get("timings_display") ?? ""),
        opening_hours: hours,
      });
      if (res.ok) toast.success("Configuration saved");
      else toast.error(res.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-display text-xl font-bold text-ink">Opening hours</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink/85">
          Add a second window for a day with a lunch break. A day with no
          windows is closed, and disappears from the booking form.
        </p>

        <div className="mt-6 space-y-4">
          {WEEKDAYS.map(([key, label]) => (
            <div key={key} className="rounded-2xl bg-cream p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-ink">{label}</span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addWindow(key)}
                  className="h-11 rounded-full px-4 text-sm"
                >
                  Add hours
                </Button>
              </div>

              {(hours[key] ?? []).length === 0 ? (
                <p className="mt-2 text-sm text-ink/85">Closed</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {(hours[key] ?? []).map((w, i) => (
                    <div key={i} className="flex flex-wrap items-end gap-2">
                      <div>
                        <Label htmlFor={`${key}-opens-${i}`} className="text-xs">
                          Opens
                        </Label>
                        <Input
                          id={`${key}-opens-${i}`}
                          type="time"
                          value={w.opens}
                          onChange={(e) => setWindow(key, i, { opens: e.target.value })}
                          className="mt-1 w-32 bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${key}-closes-${i}`} className="text-xs">
                          Closes
                        </Label>
                        <Input
                          id={`${key}-closes-${i}`}
                          type="time"
                          value={w.closes}
                          onChange={(e) => setWindow(key, i, { closes: e.target.value })}
                          className="mt-1 w-32 bg-white"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeWindow(key, i)}
                        className="h-11 rounded-full px-4 text-sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-display text-xl font-bold text-ink">Scheduling</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            id="slot_minutes"
            name="slot_minutes"
            label="Slot granularity (minutes)"
            type="number"
            min={5}
            max={120}
            defaultValue={settings.slot_minutes}
            hint="How finely the grid is divided. Appointment length comes from the treatment, not from this."
          />
          <Field
            id="buffer_minutes"
            name="buffer_minutes"
            label="Gap between appointments"
            type="number"
            min={0}
            defaultValue={settings.buffer_minutes}
          />
          <Field
            id="booking_lead_hours"
            name="booking_lead_hours"
            label="Minimum notice (hours)"
            type="number"
            min={0}
            defaultValue={settings.booking_lead_hours}
            hint="How far ahead an online booking must be. Set low and parents can book for ten minutes' time."
          />
          <Field
            id="booking_horizon_days"
            name="booking_horizon_days"
            label="Book up to (days ahead)"
            type="number"
            min={1}
            defaultValue={settings.booking_horizon_days}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-display text-xl font-bold text-ink">
          Online request limits
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-ink/85">
          A pending request holds its slot, so these limits are what stop
          someone filling the diary with requests nobody made. Raising them
          meaningfully is not advisable.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <Field
            id="pending_ttl_hours"
            name="pending_ttl_hours"
            label="Hold a request for (hours)"
            type="number"
            min={1}
            defaultValue={settings.pending_ttl_hours}
            hint="After this, an unconfirmed request expires and the slot frees itself."
          />
          <Field
            id="max_pending_per_mobile"
            name="max_pending_per_mobile"
            label="Pending per mobile"
            type="number"
            min={1}
            defaultValue={settings.max_pending_per_mobile}
          />
          <Field
            id="max_requests_per_ip_hr"
            name="max_requests_per_ip_hr"
            label="Requests per hour, per device"
            type="number"
            min={1}
            defaultValue={settings.max_requests_per_ip_hr}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-display text-xl font-bold text-ink">
          Contact details
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-ink/85">
          These appear on the public site — header, footer and every call or
          WhatsApp button.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            id="phone_display"
            name="phone_display"
            label="Phone (as shown)"
            defaultValue={settings.phone_display ?? ""}
          />
          <Field
            id="phone_href"
            name="phone_href"
            label="Phone link"
            defaultValue={settings.phone_href ?? ""}
            hint="Must start with tel:"
          />
          <Field
            id="whatsapp_href"
            name="whatsapp_href"
            label="WhatsApp link"
            defaultValue={settings.whatsapp_href ?? ""}
          />
          <Field
            id="timings_display"
            name="timings_display"
            label="Opening times (as shown)"
            defaultValue={settings.timings_display ?? ""}
          />
        </div>
      </section>

      <section className="rounded-3xl border-2 border-midnight bg-lavender/40 p-6 md:p-8">
        <h2 className="font-display text-xl font-bold text-ink">
          Data retention
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/85">
          Records for families with no recent appointment are deleted after
          this period. This is a legal setting under the DPDP Act, not a
          preference — agree the number with your adviser before changing it.
        </p>
        <div className="mt-5 max-w-xs">
          <Field
            id="retention_months"
            name="retention_months"
            label="Keep records for (months)"
            type="number"
            min={1}
            defaultValue={settings.retention_months}
          />
        </div>
      </section>

      <Button
        type="submit"
        disabled={pending}
        className="h-13 rounded-full px-8 text-base shadow-pop"
      >
        {pending ? "Saving…" : "Save configuration"}
      </Button>
    </form>
  );
}
