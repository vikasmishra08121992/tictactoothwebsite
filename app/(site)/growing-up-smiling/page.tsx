import type { Metadata } from "next";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Sticker } from "@/components/ui/sticker";
import { Section } from "@/components/layout/section";
import { HeightChartRail } from "@/components/growing-up/height-chart-rail";

export const metadata: Metadata = {
  title: "Growing Up Smiling",
  description:
    "From teething to wisdom teeth, a milestone-by-milestone guide to dental care from age 0 to 18, modelled on reception's own height chart.",
};

export default function GrowingUpSmilingPage() {
  return (
    <>
      <Section tone="wash" size="loose">
        <div className="mx-auto max-w-3xl text-center">
          <Sticker tone="tangerine" tilt="left">
            Birth to 18
          </Sticker>
          <h1 className="mt-6 text-5xl font-bold text-ink md:text-6xl">
            Growing Up Smiling
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/85 md:text-xl">
            Reception at Tic Tac Tooth has a jungle-animal height chart running
            from 40cm to 230cm. This is the same idea for teeth: every stage
            from a first tooth to a wisdom-tooth assessment, with what to do at
            each one and what parents most often worry about.
          </p>
        </div>
      </Section>

      <Section tone="tangerine" size="loose">
        {/* The rail's cards are h3, so the page needs this h2 between them and
            the h1, heading levels must not skip. */}
        <h2 className="sr-only">Dental milestones by age</h2>
        <HeightChartRail />
        {/* [CLINICAL REVIEW REQUIRED] */}
        <p className="mx-auto mt-10 max-w-2xl text-center text-lg text-ink/85">
          Every child&apos;s timeline runs a little differently. This is a
          general guide to what is typical, not a diagnosis and not a schedule
          your child ought to be meeting.
        </p>
      </Section>
      <ClosingCta
        title="Wherever your child is on the timeline"
        body="Whether it's a first tooth or a wisdom-tooth assessment, the next step starts the same way."
        cta="Book an appointment"
      />
    </>
  );
}
