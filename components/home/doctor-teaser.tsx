import { ArrowRight, GraduationCap } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ArchMask } from "@/components/motifs/arch-mask";
import { ButtonLink } from "@/components/ui/button-link";
import { doctor } from "@/lib/content/doctor";

export function DoctorTeaser() {
  return (
    <Section tone="blush" size="loose" grain>
      <div className="grid items-center gap-12 md:grid-cols-[auto_1fr] md:gap-16">
        <ArchMask className="mx-auto w-56 shadow-lift md:w-64">
          <div className="flex aspect-[3/4] w-full items-center justify-center bg-greige/25 text-ink/85">
            <GraduationCap className="size-16" aria-hidden="true" />
          </div>
        </ArchMask>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-ink">
            Meet the doctor
          </p>
          <h2 className="text-3xl font-bold text-ink md:text-5xl">{doctor.name}</h2>
          <p className="mt-2 font-semibold text-ink/85">{doctor.credentials}</p>

          <blockquote className="mt-6 max-w-xl border-l-4 border-gold pl-5 font-display text-xl leading-snug text-ink/85 md:text-2xl">
            &ldquo;{doctor.philosophy}&rdquo;
          </blockquote>

          <p className="mt-5 max-w-xl text-ink/85">{doctor.bio}</p>

          <ButtonLink
            href="/meet-the-doctor"
            variant="outline"
            size="lg"
            className="mt-7 h-13 rounded-full border-2 border-ink bg-transparent px-6 text-base text-ink hover:bg-ink hover:text-cream"
          >
            Full credentials
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
