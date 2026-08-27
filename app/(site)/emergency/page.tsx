import type { Metadata } from "next";
import { Phone, MessageCircle } from "lucide-react";
import { clinic } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Dental Emergency",
  description:
    "Dental emergencies at Tic Tac Tooth, Maninagar — knocked-out tooth, bleeding, or severe pain. Exactly what to do in the first 30 minutes, and when to call.",
};

const firstThirtyMinutes = [
  "Find the tooth. Pick it up by the crown (the white part), never the root.",
  "If it's dirty, rinse it gently in milk or saline for a few seconds only — do not scrub it.",
  "Try to place it back in the socket facing the right way, if your child can tolerate it. Do not force it.",
  "Can't put it back? Keep it in a cup of milk, or held between cheek and gum. Never store it dry, and never in plain water.",
  "Call us immediately — the tooth's best chance is being seen within 30 minutes.",
];

export default function EmergencyPage() {
  return (
    <div className="bg-ink text-cream">
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        {/* crimson on ink is only 3.0:1 — blush carries the same alarm at 6.8:1 */}
        <p className="text-center text-sm font-bold uppercase tracking-widest text-blush">
          Dental Emergency
        </p>
        <h1 className="mt-2 text-center text-4xl font-bold md:text-5xl">
          Call us right now.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-lg text-cream/85">
          Knocked-out tooth, heavy bleeding, severe pain or swelling, or a
          jaw injury — don&apos;t wait, and don&apos;t book online. Call
          {" "}{clinic.name} first, then read the steps below while you travel.
        </p>

        <div className="mx-auto mt-8 grid max-w-md gap-4">
          <a
            href={clinic.phoneHref}
            className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-crimson-btn text-xl font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Phone className="size-6" aria-hidden="true" />
            {clinic.phoneDisplay}
          </a>
          <a
            href={clinic.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-16 items-center justify-center gap-3 rounded-2xl border-2 border-leaf bg-transparent text-xl font-bold text-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            <MessageCircle className="size-6" aria-hidden="true" />
            WhatsApp us now
          </a>
        </div>

        <div className="mx-auto mt-12 max-w-lg rounded-2xl bg-cream p-6 text-ink">
          <h2 className="text-xl font-bold">
            Knocked-out permanent tooth: the first 30 minutes
          </h2>
          <ol className="mt-4 space-y-3">
            {firstThirtyMinutes.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-crimson-btn text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-ink/85">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-ink/85">
            [CLINICAL REVIEW REQUIRED] This is a general guide, not a
            substitute for calling us — call while you follow these steps if
            you can.
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-sm text-cream/75">
          {clinic.addressLines.join(", ")}
        </p>
      </div>
    </div>
  );
}
