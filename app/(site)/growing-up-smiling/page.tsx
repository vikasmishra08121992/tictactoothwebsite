import type { Metadata } from "next";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section } from "@/components/layout/section";
import { HeightChartRail } from "@/components/growing-up/height-chart-rail";
import { Sticker } from "@/components/ui/sticker";

export const metadata: Metadata = {
  title: "Growing Up Smiling",
  description:
    "From teething to wisdom teeth — a milestone-by-milestone guide to dental care from age 0 to 18, modelled on reception's own height chart.",
};

export default function GrowingUpSmilingPage() {
  return (
    <>
      <Section tone="wash" size="loose" grain>
        <div className="mx-auto max-w-3xl text-center">
          <Sticker tone="tangerine" tilt="left">
            Ages 0–18
          </Sticker>
          <h1 className="mt-6 text-5xl font-bold text-ink md:text-6xl">
            Growing Up Smiling
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/85 md:text-xl">
            Reception at Tic Tac Tooth has a jungle-animal height chart running from 40cm to 230cm. This is the same idea, for teeth — every stage from a first tooth to a wisdom-tooth assessment, with what to do at each one and what parents most often worry about.
          </p>
        </div>
      </Section>

      <Section tone="tangerine" size="loose" grain>
        {/* The rail's cards are h3, so the page needs this h2 between them and
            the h1 — heading levels must not skip. */}
        <h2 className="sr-only">Dental milestones by age</h2>
        <HeightChartRail />
        <p className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white px-6 py-5 text-center leading-relaxed text-ink/80 shadow-soft">
          Every child&apos;s timeline runs a little differently. This is a
          general guide to what is typical — not a diagnosis, and not a
          schedule your child ought to be meeting. [CLINICAL REVIEW REQUIRED]
        </p>
      </Section>
      <ClosingCta
        title="Wherever your child is on the timeline."
        body="Whether it's a first tooth or a wisdom-tooth assessment, the next step starts the same way."
        cta="Book an appointment"
      />
    </>
  );
}
