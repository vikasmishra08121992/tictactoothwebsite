import type { Metadata } from "next";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section } from "@/components/layout/section";
import { ArchMask } from "@/components/motifs/arch-mask";
import { ButtonLink } from "@/components/ui/button-link";
import { SocialStoryPreview } from "@/components/social-story/social-story-preview";
import { specialNeedsAccommodations } from "@/lib/content/special-needs";

export const metadata: Metadata = {
  title: "Special Needs & Inclusive Care",
  description:
    "Sensory-friendly appointments, longer slots, desensitisation visits, communication support, and sedation pathways for children who cannot tolerate treatment awake.",
};

export default function SpecialNeedsPage() {
  return (
    <div className="register-restrained">
      {/* ---- hero: greige and calm, arch as the shape language, no mascot ---- */}
      <div className="bg-greige/20">
        <div className="mx-auto grid max-w-[110rem] gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-greige-text">
              Special Needs &amp; Inclusive Care
            </p>
            <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[1.06] tracking-tight text-ink md:text-7xl">
              Every child is welcome here.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/85 md:text-xl">
              Tic Tac Tooth treats children with autism, ADHD, Down syndrome,
              cerebral palsy, sensory processing differences, and other
              disabilities and additional needs. What follows is exactly what we
              can offer, said plainly and without overclaiming, so you can judge
              for yourself whether it fits your child before you book.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink
                href="/book"
                size="lg"
                className="h-14 rounded-none bg-midnight px-8 text-base font-semibold text-cream hover:bg-midnight/90"
              >
                Book an appointment
              </ButtonLink>
              <ButtonLink
                href="/comfort-and-sedation"
                size="lg"
                variant="outline"
                className="h-14 rounded-none border border-ink/25 bg-transparent px-8 text-base font-semibold text-ink hover:bg-ink/5"
              >
                Comfort &amp; Sedation
              </ButtonLink>
            </div>
          </div>

          <ArchMask className="mx-auto w-full max-w-[17rem] shadow-lift">
            <div className="flex aspect-[3/4] w-full items-end bg-midnight p-7">
              <p className="text-sm leading-relaxed text-cream/75">
                [PLACEHOLDER PHOTO: the consultation room, or a quiet corner of
                the clinic. No child in frame — see DECISIONS.md.]
              </p>
            </div>
          </ArchMask>
        </div>
      </div>

      {/* ---- accommodations, as an indexed editorial list ---- */}
      <Section tone="cream" size="loose">
        <div className="flex items-end justify-between gap-6 border-b border-ink/15 pb-6">
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            How we adapt appointments
          </h2>
          <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-ink/85 sm:block">
            {String(specialNeedsAccommodations.length).padStart(2, "0")} ways
          </span>
        </div>

        <dl>
          {specialNeedsAccommodations.map((item, i) => (
            <div
              key={item.title}
              className="grid gap-3 border-b border-ink/12 py-7 md:grid-cols-[4rem_1fr_1.1fr] md:gap-8"
            >
              <dt className="font-mono text-sm text-ink/85">
                {String(i + 1).padStart(2, "0")}
              </dt>
              <dt className="text-lg font-semibold tracking-tight text-ink md:text-xl">
                {item.title}
              </dt>
              <dd className="leading-relaxed text-ink/85">{item.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ---- sedation ---- */}
      <Section tone="midnight" size="loose">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <h2 className="text-3xl font-semibold tracking-tight text-cream md:text-5xl">
            When a child cannot tolerate treatment awake
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-cream/75">
            <p>
              We offer laughing gas (nitrous oxide) sedation on site. Further sedation
              options are considered case by case. [CONFIRM: further sedation
              tiers available.]
            </p>
            <p className="text-cream/85">
              Any sedation is discussed and agreed with you in advance. It is
              never decided on the day without your consent.
            </p>
            <ButtonLink
              href="/comfort-and-sedation"
              size="lg"
              variant="outline"
              className="mt-2 h-13 rounded-none border border-cream/30 bg-transparent px-7 text-base font-semibold text-cream hover:bg-cream/10"
            >
              How we keep children comfortable
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ---- social story ---- */}
      <Section tone="white" size="loose">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Prepare your child before the visit
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/85">
            A downloadable social story — one sentence and one picture per page,
            in the order your child will experience the visit. Many parents of
            autistic children use a story like this in the days before an
            appointment. Almost no dental clinic provides one.
          </p>
        </div>
        <div className="mt-12">
          <SocialStoryPreview />
        </div>
      </Section>

      <ClosingCta
        title="Tell us what your child needs."
        body="Call or message before booking if it helps — we would rather plan the visit properly than have you arrive hoping for the best."
        showMascot={false}
      />
    </div>
  );
}
