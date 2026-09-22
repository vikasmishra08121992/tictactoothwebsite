import type { Metadata } from "next";
import Image from "next/image";
import { Award, BadgeCheck } from "lucide-react";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Sticker } from "@/components/ui/sticker";
import { Section, SectionHeading } from "@/components/layout/section";
import { ArchMask } from "@/components/motifs/arch-mask";
import { doctor } from "@/lib/content/doctor";
import { PHOTO_QUALITY } from "@/lib/images";

export const metadata: Metadata = {
  title: "Meet the Doctor",
  description:
    "Meet Dr. Roshni Chauhan, paediatric dentist at Tic Tac Tooth, Maninagar, credentials, registration, and how she approaches treating children.",
};

export default function MeetTheDoctorPage() {
  return (
    <>
      <Section tone="wash" size="loose">
        <div className="grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <ArchMask className="mx-auto w-64 shadow-lift md:w-80">
            <div className="relative aspect-[3/4] w-full">
              {/* Landscape source, cropped to the arch. The doctor sits left of
                  centre, so the crop is anchored there rather than the middle. */}
              <Image
                src={doctor.portrait.src}
                alt={doctor.portrait.alt}
                fill
                sizes="(min-width: 768px) 20rem, 16rem"
                quality={PHOTO_QUALITY}
                className="object-cover object-[35%_center]"
                // `priority` is deprecated in Next 16. This photograph is the LCP
                // element on this route, so it preloads from <head>.
                preload
              />
            </div>
          </ArchMask>

          <div>
            <Sticker tone="cream" tilt="left">
              Meet the doctor
            </Sticker>
            <h1 className="mt-6 hyphens-auto break-words text-4xl font-bold text-ink lg:text-6xl">
              {doctor.name}
            </h1>
            <p className="mt-3 text-xl font-semibold text-ink">{doctor.title}</p>
            {doctor.credentials && (
              <p className="mt-1 text-lg text-ink/85">{doctor.credentials}</p>
            )}

            <blockquote className="mt-7 max-w-xl border-l-4 border-gold pl-5 font-display text-xl leading-snug text-ink md:text-2xl">
              &ldquo;{doctor.philosophy}&rdquo;
            </blockquote>

            {doctor.bio && (
              <p className="mt-6 max-w-xl text-lg text-ink/85">{doctor.bio}</p>
            )}
            {/* [PLACEHOLDER: 2–3 sentence biography — training, special
                interests, approach. Renders once supplied.] */}
          </div>
        </div>
      </Section>

      <Section tone="lime" size="loose">
        <SectionHeading size="large" title="Credentials" />
        {/* dt/dd must be direct children of the <dl> or of a single <div>
            wrapper, nesting them two levels deep is invalid. */}
        <dl className="stagger mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          {/* Unknown values are omitted, not shown as notes.
              [PLACEHOLDER: Gujarat Dental Council registration number.] */}
          {[
            { icon: Award, term: "Qualification", value: doctor.credentials },
            {
              icon: BadgeCheck,
              term: "Registration",
              value: doctor.registrationNumber,
            },
          ]
            .filter((c) => c.value)
            .map(({ icon: Icon, term, value }) => (
            <div key={term} className="rounded-3xl bg-white p-6 shadow-soft">
              <dt className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal/20 text-teal-text">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {term}
              </dt>
              <dd className="mt-3 text-lg text-ink/85">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-2xl text-base text-ink/85">
          Qualifications and registration are published so they can be checked
          independently.
        </p>
      </Section>

      <Section tone="white" size="loose">
        <SectionHeading
          size="large"
          title="Where the conversation happens"
          description="The consultation room has a desk, two chairs and no dental equipment. A first visit usually starts here, sitting down, before anyone goes through the arch."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/consultation/consultation-room_desk-and-arched-doorway.jpg"
              alt="The consultation room: a wood desk, two chairs, botanical wallpaper, framed qualifications on a shelf and an arched doorway into the jungle treatment room"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={PHOTO_QUALITY}
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src={doctor.atWork.src}
              alt={doctor.atWork.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={PHOTO_QUALITY}
              className="object-cover object-[40%_center]"
            />
          </div>
        </div>
      </Section>
      <ClosingCta
        title="Meet in person"
        body="Book a consultation and meet the person who will be treating your child."
        cta="Book an appointment"
      />
    </>
  );
}
