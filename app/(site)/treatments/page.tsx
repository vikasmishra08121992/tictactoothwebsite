import type { Metadata } from "next";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section, SectionHeading } from "@/components/layout/section";
import { TreatmentsGrid } from "@/components/treatments/treatments-grid";
import { Sticker } from "@/components/ui/sticker";
import { treatments } from "@/lib/content/treatments";

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "Every treatment we provide, from a first infant exam through fillings and crowns to braces, wisdom-tooth assessment and sports mouthguards for teens.",
};

export default function TreatmentsPage() {
  return (
    <>
      <Section tone="wash" size="loose" grain>
        <div className="mx-auto max-w-3xl text-center">
          <Sticker tone="gold" tilt="left">
            {treatments.length} treatments · ages 0–18
          </Sticker>
          <h1 className="mt-6 text-5xl font-bold text-ink md:text-6xl">
            Everything we treat.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/85 md:text-xl">
            Everything Tic Tac Tooth treats, from a first check-up before the first birthday through to wisdom-tooth assessment and mouthguards in the teenage years. Each one explains what actually happens, step by step, and what your child will feel — so nothing in the chair is a surprise.
          </p>
        </div>
      </Section>

      <Section tone="cream" size="loose">
        <SectionHeading
          eyebrow="Care we provide"
          size="large"
          title="Pick a treatment to see what actually happens."
          description="Each one sets out the steps, what your child will feel, and the questions parents ask us most."
        />
        <div className="mt-12">
          <TreatmentsGrid />
        </div>
      </Section>

      <ClosingCta
        title="Not sure which one you need?"
        body="That is what the consultation is for. Bring the question and we will tell you what we would do, and what we would not."
        cta="Book a consultation"
      />
    </>
  );
}
