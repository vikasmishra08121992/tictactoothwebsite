import { ArrowRight, Ear, Clock3, Users, FileDown } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ArchMask } from "@/components/motifs/arch-mask";
import { ButtonLink } from "@/components/ui/button-link";

const points = [
  { icon: Ear, label: "Sensory-friendly, low-stimulation appointments" },
  { icon: Clock3, label: "Longer slots and desensitisation visits" },
  { icon: Users, label: "You stay with your child, the whole way through" },
  { icon: FileDown, label: "A printable social story to prepare at home" },
];

export function SpecialNeedsTeaser() {
  return (
    <Section tone="greige" size="loose" grain>
      <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* the arch, quoting the consult-room doorway — the trust register */}
        <ArchMask className="mx-auto w-full max-w-[19rem] shadow-lift">
          <div className="flex aspect-[3/4] w-full flex-col items-center justify-end gap-2 bg-midnight p-8 text-center">
            <span className="font-display text-6xl font-bold text-gold">1 in 5</span>
            <p className="text-sm leading-snug text-cream/75">
              [PLACEHOLDER: statistic on children with additional needs — to be
              supplied and sourced by the client, or this panel drops the figure
              entirely.]
            </p>
          </div>
        </ArchMask>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-greige-text">
            The audience every other clinic ignores
          </p>
          <h2 className="text-4xl font-bold text-ink md:text-6xl">
            Every child is welcome here. Including yours.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
            We treat children with autism, ADHD, Down syndrome, cerebral palsy
            and sensory processing differences. This is what we can offer, said
            plainly — so you can decide whether it fits your child.
          </p>

          <ul className="stagger mt-8 grid gap-3 sm:grid-cols-2">
            {points.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-cream/70 p-4"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-midnight" aria-hidden="true" />
                <span className="text-sm font-medium leading-snug text-ink/85">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <ButtonLink
            href="/special-needs"
            size="lg"
            className="mt-8 h-14 rounded-full bg-midnight px-7 text-base text-cream shadow-pop hover:bg-midnight/90"
          >
            Special Needs &amp; Inclusive Care
            <ArrowRight className="size-5" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
