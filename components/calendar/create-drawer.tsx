"use client";

import { useState, useTransition, type FormEvent } from "react";
import { fromZonedTime } from "date-fns-tz";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ClinicSettings,
  RoomPreference,
  TreatmentType,
} from "@/lib/supabase/types";
import { createStaffAppointment } from "@/lib/scheduling/actions";

const MOBILE_PATTERN = /^[6-9]\d{9}$/;

/**
 * Create an appointment from the calendar.
 *
 * The slot is fixed by wherever reception clicked, so there is no date picker
 * to get wrong. Duration comes from the treatment type, not from the person
 * booking — the same rule the public path follows, so both produce identically
 * shaped appointments.
 */
export function CreateDrawer({
  slot,
  settings,
  treatmentTypes,
  onClose,
  onCreated,
}: {
  slot: { dateKey: string; minutes: number } | null;
  settings: ClinicSettings;
  treatmentTypes: TreatmentType[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [treatmentId, setTreatmentId] = useState("");
  const [room, setRoom] = useState<RoomPreference>("no_preference");
  const [relationship, setRelationship] = useState("Mother");
  const [mobileError, setMobileError] = useState<string | null>(null);

  if (!slot) return null;

  const hh = String(Math.floor(slot.minutes / 60)).padStart(2, "0");
  const mm = String(slot.minutes % 60).padStart(2, "0");
  const label = `${slot.dateKey} at ${hh}:${mm}`;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMobileError(null);

    const form = new FormData(e.currentTarget);
    const mobile = String(form.get("parentMobile") ?? "").trim();

    if (!MOBILE_PATTERN.test(mobile)) {
      setMobileError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!treatmentId) {
      setError("Choose what the appointment is for.");
      return;
    }

    // The clicked slot is a wall-clock time in the clinic's timezone; convert
    // to an instant here rather than letting the server guess.
    const startsAt = fromZonedTime(
      `${slot!.dateKey}T${hh}:${mm}:00`,
      settings.timezone
    ).toISOString();

    startTransition(async () => {
      const res = await createStaffAppointment({
        startsAtISO: startsAt,
        treatmentTypeId: treatmentId,
        roomPreference: room,
        concern: String(form.get("concern") ?? ""),
        patientFirstName: String(form.get("patientFirstName") ?? "").trim(),
        patientDob: (String(form.get("patientDob") ?? "") || null) as string | null,
        accessibilityNotes: String(form.get("accessibilityNotes") ?? ""),
        parentName: String(form.get("parentName") ?? "").trim(),
        parentMobile: mobile,
        parentEmail: String(form.get("parentEmail") ?? "").trim(),
        relationship,
        staffNotes: String(form.get("staffNotes") ?? ""),
      });

      if (!res.ok) setError(res.error);
      else onCreated();
    });
  }

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-cream sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-ink">
            New appointment
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 px-4 pb-8">
          <p className="rounded-xl bg-mint/40 px-4 py-3 text-sm font-semibold text-ink">
            {label}
          </p>

          <div>
            <Label htmlFor="treatment">What is it for?</Label>
            {/* Without `items` the trigger would show the raw UUID. */}
            <Select
              value={treatmentId}
              onValueChange={(v) => setTreatmentId(v as string)}
              items={Object.fromEntries(
                treatmentTypes
                  .filter((t) => t.is_active)
                  .map((t) => [t.id, `${t.name} · ${t.duration_minutes} min`])
              )}
            >
              <SelectTrigger id="treatment" className="mt-1.5 w-full bg-white">
                <SelectValue placeholder="Choose a treatment" />
              </SelectTrigger>
              <SelectContent>
                {treatmentTypes
                  .filter((t) => t.is_active)
                  .map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} · {t.duration_minutes} min
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="rounded-2xl bg-white p-4 shadow-soft">
            <legend className="px-1 text-sm font-bold text-ink">Child</legend>
            <div className="mt-2 space-y-3">
              <div>
                <Label htmlFor="patientFirstName">First name</Label>
                <Input id="patientFirstName" name="patientFirstName" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="patientDob">Date of birth</Label>
                <Input id="patientDob" name="patientDob" type="date" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="accessibilityNotes">
                  Anything that would help us prepare{" "}
                  <span className="font-normal text-ink/85">(optional)</span>
                </Label>
                <Textarea
                  id="accessibilityNotes"
                  name="accessibilityNotes"
                  rows={2}
                  className="mt-1.5"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl bg-white p-4 shadow-soft">
            <legend className="px-1 text-sm font-bold text-ink">
              Parent or guardian
            </legend>
            <div className="mt-2 space-y-3">
              <div>
                <Label htmlFor="parentName">Name</Label>
                <Input id="parentName" name="parentName" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="parentMobile">Mobile</Label>
                <Input
                  id="parentMobile"
                  name="parentMobile"
                  type="tel"
                  inputMode="numeric"
                  placeholder="9XXXXXXXXX"
                  required
                  aria-invalid={!!mobileError}
                  className="mt-1.5"
                />
                {mobileError && (
                  <p className="mt-1 text-sm text-destructive">{mobileError}</p>
                )}
              </div>
              <div>
                <Label htmlFor="parentEmail">Email (optional)</Label>
                <Input id="parentEmail" name="parentEmail" type="email" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Select value={relationship} onValueChange={(v) => setRelationship(v as string)}>
                  <SelectTrigger id="relationship" className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mother", "Father", "Legal guardian", "Other family member"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          <div>
            <Label htmlFor="room">Room preference</Label>
            <Select
              value={room}
              onValueChange={(v) => setRoom(v as RoomPreference)}
              items={{
                no_preference: "No preference",
                space: "Smiling Adventures (Space)",
                jungle: "Jungle Smiles",
              }}
            >
              <SelectTrigger id="room" className="mt-1.5 w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_preference">No preference</SelectItem>
                <SelectItem value="space">Smiling Adventures (Space)</SelectItem>
                <SelectItem value="jungle">Jungle Smiles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="staffNotes">Staff notes (optional)</Label>
            <Textarea id="staffNotes" name="staffNotes" rows={2} className="mt-1.5 bg-white" />
          </div>

          {error && (
            <p role="alert" className="text-sm font-semibold text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-full text-base"
          >
            {pending ? "Saving…" : "Create appointment"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
