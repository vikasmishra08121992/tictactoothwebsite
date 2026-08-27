import type { Metadata } from "next";
import { GraduationCap, Award, BadgeCheck } from "lucide-react";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section, SectionHeading } from "@/components/layout/section";
import { ArchMask } from "@/components/motifs/arch-mask";
import { Sticker } from "@/components/ui/sticker";
import { doctor } from "@/lib/content/doctor";

export const metadata: Metadata = {
  title: "Meet the Doctor",
  description:
    "Credentials, registration, and approach — meet the doctor at Tic Tac Tooth.",
};

export default function MeetTheDoctorPage() {
  return (
    <>
      <Section tone="wash" size="loose" grain>
        <div className="grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <ArchMask className="mx-auto w-60 shadow-lift md:w-72">
            <div className="flex aspect-[3/4] w-full items-center justify-center bg-greige/30 text-ink/30">
              <GraduationCap className="size-16" aria-hidden="true" />
            </div>
          </ArchMask>

          <div>
            <Sticker tone="cream" tilt="left">
              Meet the doctor
            </Sticker>
            <h1 className="mt-6 hyphens-auto break-words text-4xl font-bold text-ink lg:text-6xl">
              {doctor.name}
            </h1>
            <p className="mt-3 font-semibold text-ink/85">{doctor.credentials}</p>

            <blockquote className="mt-7 max-w-xl border-l-4 border-gold pl-5 font-display text-xl leading-snug text-ink md:text-2xl">
              &ldquo;{doctor.philosophy}&rdquo;
            </blockquote>

            <p className="mt-6 max-w-xl leading-relaxed text-ink/80">{doctor.bio}</p>
          </div>
        </div>
      </Section>

      <Section tone="lime" size="loose" grain>
        <SectionHeading eyebrow="On the record" size="large" title="Credentials" />
        {/* dt/dd must be direct children of the <dl> or of a single <div>
            wrapper — nesting them two levels deep is invalid. */}
        <dl className="stagger mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          {[
            { icon: Award, term: "Qualification", value: doctor.credentials },
            {
              icon: BadgeCheck,
              term: "Registration",
              value: doctor.registrationNumber,
            },
          ].map(({ icon: Icon, term, value }) => (
            <div key={term} className="hover-lift rounded-3xl bg-white p-6 shadow-soft">
              <dt className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal/20 text-teal-text">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {term}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink/85">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink/85">
          Registration numbers and qualifications are published here so they can
          be checked independently. Both are placeholders until the client
          supplies the real values.
        </p>
      </Section>
      <ClosingCta
        title="Meet in person."
        body="Credentials only tell you so much. Meeting the person telling your child what happens next tells you the rest."
        cta="Book an appointment"
      />
    </>
  );
}
