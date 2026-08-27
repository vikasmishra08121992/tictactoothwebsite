import type { Metadata } from "next";
import { Phone, MessageCircle } from "lucide-react";
import { Section } from "@/components/layout/section";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { Sticker } from "@/components/ui/sticker";
import { getTreatmentTypes, getPublicConfig } from "@/lib/booking/public-data";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book an appointment at Tic Tac Tooth — or reach us on WhatsApp or by phone instead.",
};

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const [treatments, config] = await Promise.all([
    getTreatmentTypes(),
    getPublicConfig(),
  ]);

  return (
    <Section tone="wash" size="loose" grain>
      <div className="mx-auto max-w-3xl text-center">
        <Sticker tone="mint" tilt="left">
          Six quick steps
        </Sticker>
        <h1 className="mt-6 text-5xl font-bold text-ink md:text-6xl">
          Let&apos;s get you booked in.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink/85 md:text-xl">
          We ask for your child&apos;s first name and date of birth, and nothing clinical
          — that part is a conversation with the dentist, not a form field.
        </p>

        {/* the two parallel paths, at equal weight, before the form starts */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
          <span className="text-ink/85">In a hurry?</span>
          <a
            href={config.phoneHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink px-5 py-2 text-ink transition-colors hover:bg-ink hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Phone className="size-4" aria-hidden="true" />
            Call instead
          </a>
          <a
            href={config.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-leaf-text px-5 py-2 text-leaf-text transition-colors hover:bg-leaf-text hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp instead
          </a>
        </div>
      </div>

      <div className="mt-14">
        <BookingWizard
          treatments={treatments}
          horizonDays={config.horizonDays}
          whatsappHref={config.whatsappHref}
        />
      </div>
    </Section>
  );
}
