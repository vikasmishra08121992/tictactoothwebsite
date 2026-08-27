import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/section";
import { ArchMask } from "@/components/motifs/arch-mask";
import { Mascot } from "@/components/mascot/mascot";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { treatments, getTreatment } from "@/lib/content/treatments";

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/treatments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  return {
    title: treatment.name,
    description: `${treatment.shortDescription} What happens step by step at Tic Tac Tooth, and what your child will feel.`,
  };
}

export default async function TreatmentDetailPage({
  params,
}: PageProps<"/treatments/[slug]">) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  return (
    <>
      <Section tone="wash" size="loose" grain>
        <div className="grid items-start gap-12 md:grid-cols-[1fr_auto]">
          <div>
            <p className="inline-block rounded-full bg-white/70 px-4 py-1.5 text-sm font-bold text-teal-text">
              {treatment.ageNote}
            </p>
            <h1 className="mt-5 max-w-2xl text-5xl font-bold text-ink md:text-6xl">
              {treatment.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/85 md:text-xl">
              {treatment.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/book" size="lg" className="h-14 rounded-full px-7 text-base shadow-pop">
                Book a consultation
              </ButtonLink>
              <ButtonLink
                href="/treatments"
                variant="outline"
                size="lg"
                className="h-14 rounded-full border-2 border-ink bg-transparent px-6 text-base text-ink hover:bg-ink hover:text-cream"
              >
                All treatments
              </ButtonLink>
            </div>
          </div>

          {/* the mascot explains it in the child's own words — the kid
              register showing up inside an otherwise parent-facing page */}
          {treatment.kidExplainer && (
            <ArchMask className="mx-auto w-full max-w-[17rem] shadow-lift">
              <div className="flex flex-col items-center gap-3 bg-tangerine/25 p-7 text-center">
                <Mascot pose="calm" className="h-28 w-auto" />
                <p className="font-display text-base font-bold leading-snug text-ink">
                  &ldquo;{treatment.kidExplainer}&rdquo;
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-tangerine-text">
                  How we explain it
                </p>
              </div>
            </ArchMask>
          )}
        </div>
      </Section>

      <Section tone="white" size="loose">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="What happens" size="large" title="Step by step" />
          <div>
            <ol className="space-y-5">
              {treatment.whatHappens.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint/40 font-display text-sm font-bold text-mint-text">
                    {i + 1}
                  </span>
                  <span className="pt-1 leading-relaxed text-ink/85">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-2xl bg-cream p-6 shadow-soft">
              <p className="flex items-center gap-2 font-display text-base font-bold text-ink">
                <CheckCircle2 className="size-5 text-leaf-text" aria-hidden="true" />
                What your child will feel
              </p>
              <p className="mt-2 leading-relaxed text-ink/80">
                {treatment.whatChildFeels}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {treatment.parentFaq.length > 0 && (
        <Section tone="cream" size="loose">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading eyebrow="Parents ask" size="large" title="Common questions" />
            <Accordion className="border-t border-ink/12">
              {treatment.parentFaq.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-ink/12">
                  <AccordionTrigger className="py-5 text-left font-display text-lg font-bold text-ink">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 leading-relaxed text-ink/80">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>
      )}
    </>
  );
}
