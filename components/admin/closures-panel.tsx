"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CalendarOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Closure } from "@/lib/supabase/types";
import { addClosure, removeClosure } from "@/lib/admin/actions";

/**
 * Holidays and blocked periods.
 *
 * A closure removes those days from the public booking form immediately, but
 * does NOT touch appointments already in the diary — cancelling someone's
 * appointment as a side effect of adding a holiday would be a nasty surprise.
 * Reception is told to move them deliberately.
 */
export function ClosuresPanel({ closures }: { closures: Closure[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
      <h2 className="font-display text-xl font-bold text-ink">
        Holidays &amp; closures
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/85">
        Closed days disappear from the booking form straight away. Appointments
        already booked on those days are left alone — check the calendar and
        move them yourself.
      </p>

      <form
        className="mt-6 grid gap-4 rounded-2xl bg-cream p-4 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const starts_on = String(f.get("starts_on") ?? "");
          const ends_on = String(f.get("ends_on") ?? "");
          const reason = String(f.get("reason") ?? "").trim();

          if (!starts_on || !ends_on || !reason) return;
          if (ends_on < starts_on) {
            toast.error("The end date is before the start date.");
            return;
          }

          const form = e.currentTarget;
          startTransition(async () => {
            const res = await addClosure({ starts_on, ends_on, reason });
            if (res.ok) {
              toast.success("Closure added");
              form.reset();
            } else toast.error(res.error);
          });
        }}
      >
        <div>
          <Label htmlFor="starts_on">From</Label>
          <Input id="starts_on" name="starts_on" type="date" required className="mt-1.5 bg-white" />
        </div>
        <div>
          <Label htmlFor="ends_on">To</Label>
          <Input id="ends_on" name="ends_on" type="date" required className="mt-1.5 bg-white" />
        </div>
        <div>
          <Label htmlFor="reason">Reason</Label>
          <Input
            id="reason"
            name="reason"
            required
            placeholder="Diwali"
            className="mt-1.5 bg-white"
          />
        </div>
        <Button type="submit" disabled={pending} className="h-11 rounded-full px-5">
          Add
        </Button>
      </form>

      {closures.length === 0 ? (
        <p className="mt-6 text-sm text-ink/85">No closures set.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {closures.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl bg-cream px-4 py-3"
            >
              <CalendarOff className="size-4 shrink-0 text-crimson-text" aria-hidden="true" />
              <span className="font-semibold text-ink">{c.reason}</span>
              <span className="text-sm text-ink/85">
                {c.starts_on}
                {c.ends_on !== c.starts_on && ` – ${c.ends_on}`}
              </span>
              <Button
                variant="outline"
                disabled={pending}
                aria-label={`Remove closure: ${c.reason}`}
                onClick={() =>
                  startTransition(async () => {
                    const res = await removeClosure(c.id);
                    if (res.ok) toast.success("Closure removed");
                    else toast.error(res.error);
                  })
                }
                className="ml-auto h-11 rounded-full px-4"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
