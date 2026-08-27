import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { treatments } from "@/lib/content/treatments";

const tints = [
  "bg-white hover:bg-coral/20",
  "bg-white hover:bg-mint/30",
  "bg-white hover:bg-blush/25",
  "bg-white hover:bg-lime/30",
  "bg-white hover:bg-lavender/40",
  "bg-white hover:bg-tangerine/25",
];

export function TreatmentsPreview() {
  return (
    <Section tone="gold" size="loose" grain>
      <SectionHeading
        eyebrow="Care we provide"
        size="large"
        title={`${treatments.length} treatments, from first tooth to wisdom tooth.`}
        description="Infant exams, fillings and crowns, braces and aligners, sports mouthguards, sedation and general anaesthesia — including everything our teenage patients come in for."
      />

      <ul className="stagger mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {treatments.map((t, i) => (
          <li key={t.slug}>
            <Link
              href={`/treatments/${t.slug}`}
              className={`flex h-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left font-display text-base font-bold text-ink shadow-soft transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                tints[i % tints.length]
              }`}
            >
              <span>
                {t.name}
                {t.teenRelevant && (
                  <span className="ml-2 inline-flex rounded-full bg-ink px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide text-cream">
                    Teens
                  </span>
                )}
              </span>
              <ArrowRight className="size-4 shrink-0 text-crimson-btn" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <ButtonLink
        href="/treatments"
        size="lg"
        className="mt-10 h-13 rounded-full px-7 text-base shadow-pop"
      >
        See full treatment details
        <ArrowRight className="size-5" aria-hidden="true" />
      </ButtonLink>
    </Section>
  );
}
