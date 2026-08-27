"use client";

import { useEffect, useState, useTransition } from "react";
import {
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonLink } from "@/components/ui/button-link";
import { Mascot } from "@/components/mascot/mascot";
import { rooms } from "@/lib/content/rooms";
import { relationshipOptions } from "@/lib/content/booking";
import { getAvailableSlots, requestAppointment } from "@/lib/booking/actions";
import type { PublicTreatment } from "@/lib/booking/public-data";
import type { RoomPreference } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type FormState = {
  treatmentTypeId: string;
  concern: string;
  room: RoomPreference | "";
  date: string;
  /** ISO timestamp of the chosen slot, as returned by the availability RPC. */
  slot: string;
  patientFirstName: string;
  patientDob: string;
  accessibilityNotes: string;
  parentName: string;
  parentMobile: string;
  parentEmail: string;
  relationship: string;
  consent: boolean;
};

const initialState: FormState = {
  treatmentTypeId: "",
  concern: "",
  room: "",
  date: "",
  slot: "",
  patientFirstName: "",
  patientDob: "",
  accessibilityNotes: "",
  parentName: "",
  parentMobile: "",
  parentEmail: "",
  relationship: "",
  consent: false,
};

const STEP_LABELS = [
  "Concern",
  "Room",
  "Date & time",
  "Patient",
  "Parent",
  "Consent & confirm",
];

const MOBILE_PATTERN = /^[6-9]\d{9}$/;

/** DD/MM/YYYY — the format every other date on this site uses. */
const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/** Renders a slot timestamp in clinic time, regardless of the visitor's own. */
const fmtSlot = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

const todayKey = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

const dateKeyIn = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);
};

export function BookingWizard({
  treatments,
  horizonDays,
  whatsappHref,
}: {
  treatments: PublicTreatment[];
  horizonDays: number;
  whatsappHref: string;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initialState);
  const [reference, setReference] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, startSubmit] = useTransition();

  /*
    Availability is stored against the (date, treatment) pair it was fetched
    for, rather than being cleared whenever either changes. Clearing meant a
    setState in an effect body, and — more importantly — a window in which a
    stale list of times was still on screen and clickable while the new one
    loaded. Deriving from the key closes that window: if the key does not
    match, there are no times to show, full stop.
  */
  const [fetched, setFetched] = useState<{ key: string; slots: string[] } | null>(
    null
  );
  // Bumped when a slot is lost to someone else mid-submission, so the same
  // date and treatment re-fetch instead of re-showing the list that contained
  // the slot we just failed to book.
  const [refreshToken, setRefreshToken] = useState(0);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const treatment = treatments.find((t) => t.id === data.treatmentTypeId);

  /**
   * Availability is fetched, never guessed. The previous static list of times
   * would happily offer a slot that was booked, closed or past the lead time —
   * the parent only found out after filling in the rest of the form.
   */
  const slotKey =
    data.date && data.treatmentTypeId
      ? `${data.date}|${data.treatmentTypeId}|${refreshToken}`
      : null;

  const slots = fetched?.key === slotKey ? fetched.slots : null;
  const loadingSlots = slotKey !== null && slots === null;

  useEffect(() => {
    if (!slotKey) return;

    const [dateKey, treatmentId] = slotKey.split("|");
    let cancelled = false;

    getAvailableSlots(dateKey, treatmentId)
      .then((s) => {
        if (!cancelled) setFetched({ key: slotKey, slots: s });
      })
      .catch(() => {
        if (!cancelled) setFetched({ key: slotKey, slots: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [slotKey]);

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !data.treatmentTypeId) e.treatment = "Please choose a concern.";
    if (step === 1 && !data.room) e.room = "Please choose a room, or no preference.";
    if (step === 2) {
      if (!data.date) e.date = "Please choose a date.";
      if (!data.slot) e.slot = "Please choose a time.";
    }
    if (step === 3) {
      if (!data.patientFirstName.trim()) e.patientFirstName = "First name is required.";
      if (!data.patientDob) e.patientDob = "Date of birth is required.";
      else if (data.patientDob > todayKey())
        e.patientDob = "That date is in the future.";
    }
    if (step === 4) {
      if (!data.parentName.trim()) e.parentName = "Your name is required.";
      if (!MOBILE_PATTERN.test(data.parentMobile.trim()))
        e.parentMobile = "Enter a valid 10-digit Indian mobile number.";
      if (!data.relationship) e.relationship = "Please select your relationship to the patient.";
    }
    if (step === 5 && !data.consent) e.consent = "Consent is required to book.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    startSubmit(async () => {
      const res = await requestAppointment({
        startsAtISO: data.slot,
        treatmentTypeId: data.treatmentTypeId,
        roomPreference: (data.room || "no_preference") as RoomPreference,
        concern: data.concern,
        patientFirstName: data.patientFirstName.trim(),
        patientDob: data.patientDob || null,
        accessibilityNotes: data.accessibilityNotes.trim(),
        parentName: data.parentName.trim(),
        parentMobile: data.parentMobile.trim(),
        parentEmail: data.parentEmail.trim(),
        relationship: data.relationship,
      });

      if (res.ok) {
        setReference(res.reference);
      } else {
        // A lost slot is recoverable — send them back to the step that can fix
        // it rather than leaving a dead error on the confirm screen.
        const lostSlot = /took that time|no longer available|not available/i.test(res.error);
        setErrors({ submit: res.error });
        if (lostSlot) {
          setData((d) => ({ ...d, slot: "" }));
          setRefreshToken((t) => t + 1);
          setStep(2);
        }
      }
    });
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === STEP_LABELS.length - 1) {
      submit();
      return;
    }
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  if (reference) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-ink/10 bg-white p-8 text-center">
        <Mascot pose="hero" className="mx-auto h-28 w-auto" />
        <h2 className="mt-4 text-2xl font-bold text-ink">Request received!</h2>
        <p className="mt-2 leading-relaxed text-ink/85">
          We&apos;ve held {fmtSlot(data.slot)} on {fmtDate(data.date)} for{" "}
          {data.patientFirstName}. Someone from reception will call to confirm
          — the appointment isn&apos;t final until they do.
        </p>

        <p className="mt-5 rounded-xl bg-gold/25 px-4 py-3 text-sm text-ink">
          Your reference: <strong className="font-mono text-base">{reference}</strong>
        </p>

        <div className="mt-6 rounded-xl bg-cream p-4 text-left text-sm text-ink/85">
          <p><strong className="text-ink">Reason:</strong> {treatment?.name}</p>
          <p>
            <strong className="text-ink">Room:</strong>{" "}
            {data.room === "no_preference"
              ? "No preference"
              : rooms.find((r) => r.slug === data.room)?.name}
          </p>
          <p><strong className="text-ink">Patient:</strong> {data.patientFirstName}</p>
          <p><strong className="text-ink">Parent:</strong> {data.parentName} ({data.relationship})</p>
        </div>

        <Button
          className="mt-6"
          onClick={() => {
            setData(initialState);
            setStep(0);
            setReference(null);
            setErrors({});
          }}
        >
          Book another appointment
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* progress */}
      <ol
        className="mb-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
        aria-label="Booking steps"
      >
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-bold",
                i === step
                  ? "bg-crimson-btn text-white"
                  : i < step
                    ? "bg-leaf/30 text-leaf-text"
                    : "bg-ink/10 text-ink/85"
              )}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <CheckCircle2 className="size-4" aria-hidden="true" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-semibold sm:inline",
                i === step ? "text-ink" : "text-ink/85"
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8">
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold text-ink">What brings you in?</h2>

            {treatments.length === 0 ? (
              <p className="mt-4 rounded-xl bg-crimson/15 p-4 text-sm leading-relaxed text-crimson-text">
                We can&apos;t load our appointment types right now, so online
                booking is unavailable for the moment. Please call or WhatsApp
                us instead — the links are just below.
              </p>
            ) : (
              <RadioGroup
                className="mt-4"
                value={data.treatmentTypeId}
                onValueChange={(v) => update("treatmentTypeId", v as string)}
              >
                {treatments.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-3 rounded-lg border border-ink/10 p-3 hover:bg-cream"
                  >
                    <RadioGroupItem value={t.id} id={`treatment-${t.slug}`} />
                    <span className="text-sm text-ink">
                      {t.name}
                      <span className="ml-2 text-ink/85">
                        · about {t.duration_minutes} min
                      </span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            )}

            <div className="mt-4">
              <Label htmlFor="concern">
                Anything you&apos;d like to add?{" "}
                <span className="font-normal text-ink/85">(optional)</span>
              </Label>
              <Input
                id="concern"
                className="mt-1.5"
                value={data.concern}
                onChange={(e) => update("concern", e.target.value)}
              />
            </div>

            {errors.treatment && (
              <p className="mt-2 text-sm text-destructive">{errors.treatment}</p>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-ink">Which room would you prefer?</h2>
            <p className="mt-1 text-sm text-ink/85">
              Not sure? Choose &ldquo;No preference&rdquo; — we&apos;ll let your
              child pick on the day.
            </p>
            <RadioGroup
              className="mt-4 sm:grid-cols-3"
              value={data.room}
              onValueChange={(v) => update("room", v as RoomPreference)}
            >
              {rooms.map((r) => (
                <label
                  key={r.slug}
                  className="flex items-center gap-3 rounded-lg border border-ink/10 p-3 hover:bg-cream"
                >
                  <RadioGroupItem value={r.slug} id={`room-${r.slug}`} />
                  <span className="text-sm text-ink">{r.name}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 rounded-lg border border-ink/10 p-3 hover:bg-cream">
                <RadioGroupItem value="no_preference" id="room-no-preference" />
                <span className="text-sm text-ink">No preference</span>
              </label>
            </RadioGroup>
            {errors.room && <p className="mt-2 text-sm text-destructive">{errors.room}</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-ink">Pick a date &amp; time</h2>
            <p className="mt-1 text-sm text-ink/85">
              Times shown are the ones actually free for a{" "}
              {treatment?.duration_minutes ?? 30}-minute visit, in IST.
            </p>

            <div className="mt-4">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                min={todayKey()}
                max={dateKeyIn(horizonDays)}
                className="mt-1.5 sm:max-w-xs"
                value={data.date}
                onChange={(e) => {
                  update("date", e.target.value);
                  update("slot", "");
                }}
                aria-invalid={!!errors.date}
              />
              {errors.date && <p className="mt-1 text-sm text-destructive">{errors.date}</p>}
            </div>

            <div className="mt-5">
              <span className="text-sm font-semibold text-ink">Time (IST)</span>

              {!data.date && (
                <p className="mt-2 text-sm text-ink/85">Choose a date first.</p>
              )}

              {loadingSlots && (
                <p className="mt-2 flex items-center gap-2 text-sm text-ink/85">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Checking what&apos;s free…
                </p>
              )}

              {!loadingSlots && slots?.length === 0 && (
                <p className="mt-2 rounded-xl bg-cream p-4 text-sm leading-relaxed text-ink/85">
                  Nothing free on {fmtDate(data.date)} — we may be closed, or
                  fully booked. Try another date, or call us and we&apos;ll find
                  something.
                </p>
              )}

              {!loadingSlots && slots && slots.length > 0 && (
                <div
                  role="radiogroup"
                  aria-label="Available times"
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {slots.map((s) => {
                    const selected = data.slot === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => update("slot", s)}
                        className={cn(
                          "min-h-11 rounded-full border-2 px-4 text-sm font-semibold transition-colors",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          selected
                            ? "border-crimson-btn bg-crimson-btn text-white"
                            : "border-ink/20 text-ink hover:bg-cream"
                        )}
                      >
                        {fmtSlot(s)}
                      </button>
                    );
                  })}
                </div>
              )}

              {errors.slot && <p className="mt-2 text-sm text-destructive">{errors.slot}</p>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-ink">About the patient</h2>
            <p className="mt-1 text-sm text-ink/85">
              Just a first name and date of birth here — anything clinical is a
              conversation with the dentist, not a form field.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="patient-name">Child&apos;s first name</Label>
                <Input
                  id="patient-name"
                  className="mt-1.5"
                  value={data.patientFirstName}
                  onChange={(e) => update("patientFirstName", e.target.value)}
                  aria-invalid={!!errors.patientFirstName}
                />
                {errors.patientFirstName && (
                  <p className="mt-1 text-sm text-destructive">{errors.patientFirstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="patient-dob">Date of birth</Label>
                <Input
                  id="patient-dob"
                  type="date"
                  max={todayKey()}
                  className="mt-1.5"
                  value={data.patientDob}
                  onChange={(e) => update("patientDob", e.target.value)}
                  aria-describedby="dob-help"
                  aria-invalid={!!errors.patientDob}
                />
                <p id="dob-help" className="mt-1 text-xs text-ink/85">
                  We store the date rather than an age, so the record stays
                  correct as your child grows.
                </p>
                {errors.patientDob && (
                  <p className="mt-1 text-sm text-destructive">{errors.patientDob}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="accessibility-notes">
                Anything that would help us prepare?{" "}
                <span className="font-normal text-ink/85">(optional)</span>
              </Label>
              <p id="notes-help" className="mt-1 text-xs text-ink/85">
                Sensory sensitivities, communication preferences, anything that
                would help this visit go smoothly — entirely up to you to share.
              </p>
              <Textarea
                id="accessibility-notes"
                aria-describedby="notes-help"
                className="mt-1.5"
                rows={3}
                value={data.accessibilityNotes}
                onChange={(e) => update("accessibilityNotes", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-ink">About you</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="parent-name">Your name</Label>
                <Input
                  id="parent-name"
                  className="mt-1.5"
                  value={data.parentName}
                  onChange={(e) => update("parentName", e.target.value)}
                  aria-invalid={!!errors.parentName}
                />
                {errors.parentName && (
                  <p className="mt-1 text-sm text-destructive">{errors.parentName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="parent-mobile">Mobile number</Label>
                <Input
                  id="parent-mobile"
                  type="tel"
                  inputMode="numeric"
                  placeholder="9XXXXXXXXX"
                  className="mt-1.5"
                  value={data.parentMobile}
                  onChange={(e) => update("parentMobile", e.target.value)}
                  aria-invalid={!!errors.parentMobile}
                />
                {errors.parentMobile && (
                  <p className="mt-1 text-sm text-destructive">{errors.parentMobile}</p>
                )}
              </div>
              <div>
                <Label htmlFor="parent-email">
                  Email <span className="font-normal text-ink/85">(optional)</span>
                </Label>
                <Input
                  id="parent-email"
                  type="email"
                  className="mt-1.5"
                  value={data.parentEmail}
                  onChange={(e) => update("parentEmail", e.target.value)}
                  aria-describedby="email-help"
                />
                <p id="email-help" className="mt-1 text-xs text-ink/85">
                  Where we send your confirmation. Without it we&apos;ll only
                  reach you by phone.
                </p>
              </div>
              <div>
                <Label htmlFor="relationship">Relationship to patient</Label>
                <Select
                  value={data.relationship}
                  onValueChange={(v) => update("relationship", v as string)}
                >
                  <SelectTrigger
                    id="relationship"
                    className="mt-1.5 w-full"
                    aria-invalid={!!errors.relationship}
                  >
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.relationship && (
                  <p className="mt-1 text-sm text-destructive">{errors.relationship}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-ink">Confirm &amp; consent</h2>
            <div className="mt-4 space-y-1 rounded-xl bg-cream p-4 text-sm text-ink/85">
              <p><strong className="text-ink">Reason:</strong> {treatment?.name ?? "—"}</p>
              <p>
                <strong className="text-ink">Room:</strong>{" "}
                {data.room === "no_preference"
                  ? "No preference"
                  : (rooms.find((r) => r.slug === data.room)?.name ?? "—")}
              </p>
              <p>
                <strong className="text-ink">Date &amp; time:</strong>{" "}
                {fmtDate(data.date)} at {data.slot ? fmtSlot(data.slot) : "—"} IST
              </p>
              <p><strong className="text-ink">Patient:</strong> {data.patientFirstName || "—"}</p>
              <p>
                <strong className="text-ink">Parent:</strong>{" "}
                {data.parentName || "—"} · {data.parentMobile || "—"} ·{" "}
                {data.relationship || "—"}
              </p>
            </div>

            <p className="mt-4 rounded-xl bg-gold/25 p-4 text-sm leading-relaxed text-ink">
              This sends a <strong>request</strong>. We hold the time for you
              and reception calls to confirm it — you&apos;ll hear from us
              before the appointment is final.
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-ink/15 p-4">
              <Checkbox
                id="consent"
                checked={data.consent}
                onCheckedChange={(v) => update("consent", v === true)}
                aria-invalid={!!errors.consent}
                className="mt-0.5"
              />
              <Label
                htmlFor="consent"
                className="text-sm font-normal leading-relaxed text-ink/85"
              >
                I confirm I am this child&apos;s parent or legal guardian, and I
                consent to their information above being used solely to
                schedule and prepare for this dental appointment. Read our{" "}
                <PrivacyNoticeLink />.
              </Label>
            </div>
            {errors.consent && (
              <p className="mt-2 text-sm text-destructive">{errors.consent}</p>
            )}
            {errors.submit && (
              <p role="alert" className="mt-3 rounded-xl bg-crimson/15 p-3 text-sm text-crimson-text">
                {errors.submit}
              </p>
            )}
          </div>
        )}

        {step === 2 && errors.submit && (
          <p role="alert" className="mt-4 rounded-xl bg-crimson/15 p-3 text-sm text-crimson-text">
            {errors.submit}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={back} disabled={step === 0 || submitting}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
          <Button onClick={next} disabled={submitting}>
            {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {step === STEP_LABELS.length - 1
              ? submitting
                ? "Sending…"
                : "Send request"
              : "Continue"}
            {step < STEP_LABELS.length - 1 && (
              <ArrowRight className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* equal-weight WhatsApp path, present from step one */}
      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-ink/85">Prefer not to fill in a form?</p>
        <ButtonLink
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
          className="border-leaf-text bg-leaf/15 text-leaf-text hover:bg-leaf/25"
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          Book on WhatsApp instead
        </ButtonLink>
      </div>
    </div>
  );
}

function PrivacyNoticeLink() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="font-semibold text-ink underline underline-offset-2"
      >
        privacy notice
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-dialog-title"
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 text-left text-sm leading-relaxed text-ink/85"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="privacy-dialog-title" className="text-lg font-bold text-ink">
              The short version
            </h3>
            <ul className="mt-3 ml-5 list-disc space-y-2">
              <li>
                We collect your child&apos;s first name and date of birth, your
                contact details, and the reason for the visit. Nothing more.
              </li>
              <li>
                We use it to schedule and prepare for the appointment, and to
                keep a visit history for the dentist.
              </li>
              <li>
                No analytics, no advertising pixels, no tracking of any kind on
                this website.
              </li>
              <li>
                You can ask us to delete everything at any time, and we will.
              </li>
            </ul>

            <p className="mt-4">
              The full notice explains how long we keep records, who processes
              them, and how to ask for deletion.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/privacy" target="_blank" rel="noopener noreferrer">
                Read the full notice
              </ButtonLink>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
