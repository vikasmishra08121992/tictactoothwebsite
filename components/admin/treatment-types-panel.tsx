"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { TreatmentType } from "@/lib/supabase/types";
import { upsertTreatmentType } from "@/lib/admin/actions";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function TreatmentTypesPanel({
  treatmentTypes,
}: {
  treatmentTypes: TreatmentType[];
}) {
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);

  function save(input: Parameters<typeof upsertTreatmentType>[0]) {
    startTransition(async () => {
      const res = await upsertTreatmentType(input);
      if (res.ok) {
        toast.success("Saved");
        setAdding(false);
      } else toast.error(res.error);
    });
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            Appointment types
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink/85">
            Duration here decides how much of the calendar an appointment
            occupies, and what the booking form offers.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setAdding((a) => !a)}
          className="h-11 rounded-full px-5"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add type
        </Button>
      </div>

      {adding && (
        <form
          className="mt-6 rounded-2xl bg-cream p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const name = String(f.get("name") ?? "").trim();
            if (!name) return;
            save({
              name,
              slug: slugify(name),
              duration_minutes: Number(f.get("duration_minutes")),
              requires_review: f.get("requires_review") === "on",
              is_active: true,
              sort_order: treatmentTypes.length,
            });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
            <div>
              <Label htmlFor="new-name">Name</Label>
              <Input id="new-name" name="name" required className="mt-1.5 bg-white" />
            </div>
            <div>
              <Label htmlFor="new-duration">Minutes</Label>
              <Input
                id="new-duration"
                name="duration_minutes"
                type="number"
                min={5}
                defaultValue={30}
                className="mt-1.5 bg-white"
              />
            </div>
            <Button type="submit" disabled={pending} className="h-11 rounded-full px-5">
              Add
            </Button>
          </div>
          <label className="mt-3 flex items-center gap-2.5 text-sm text-ink">
            <Checkbox name="requires_review" />
            Flag for reception to review
          </label>
        </form>
      )}

      <ul className="mt-6 space-y-3">
        {treatmentTypes.map((t) => (
          <li key={t.id}>
            <form
              className="grid gap-3 rounded-2xl bg-cream p-4 sm:grid-cols-[2fr_auto_auto_auto] sm:items-center"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                save({
                  id: t.id,
                  name: String(f.get("name") ?? "").trim(),
                  slug: t.slug,
                  duration_minutes: Number(f.get("duration_minutes")),
                  requires_review: f.get("requires_review") === "on",
                  is_active: f.get("is_active") === "on",
                  sort_order: t.sort_order,
                });
              }}
            >
              <div>
                <Label htmlFor={`name-${t.id}`} className="sr-only">
                  Name
                </Label>
                <Input
                  id={`name-${t.id}`}
                  name="name"
                  defaultValue={t.name}
                  className="bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor={`dur-${t.id}`} className="text-xs whitespace-nowrap">
                  Mins
                </Label>
                <Input
                  id={`dur-${t.id}`}
                  name="duration_minutes"
                  type="number"
                  min={5}
                  defaultValue={t.duration_minutes}
                  className="w-24 bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-ink">
                  <Checkbox name="is_active" defaultChecked={t.is_active} />
                  Bookable
                </label>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <Checkbox name="requires_review" defaultChecked={t.requires_review} />
                  Review
                </label>
              </div>

              <Button
                type="submit"
                variant="outline"
                disabled={pending}
                className="h-11 rounded-full px-4"
              >
                <Save className="size-4" aria-hidden="true" />
                Save
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
