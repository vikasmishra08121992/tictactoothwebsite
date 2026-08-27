import type { Metadata } from "next";
import { Star, Quote } from "lucide-react";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section } from "@/components/layout/section";
import { Sticker } from "@/components/ui/sticker";
import { reviews, reviewStats } from "@/lib/content/reviews";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Real, unedited reviews of Tic Tac Tooth Kids Dental Hospital in Maninagar, Ahmedabad, left by parents on Google.",
};

const cardTones = [
  "bg-blush/25 rotate-[-1.2deg]",
  "bg-mint/30 rotate-[0.9deg]",
  "bg-lime/25 rotate-[-0.6deg]",
  "bg-lavender/35 rotate-[1deg]",
  "bg-tangerine/20 rotate-[-0.9deg]",
  "bg-cream rotate-[0.6deg]",
];

export default function ReviewsPage() {
  return (
    <>
      <Section tone="wash" size="loose" grain>
        <div className="mx-auto max-w-3xl text-center">
          <Sticker tone="gold" tilt="right">
            <Star className="size-4" aria-hidden="true" fill="currentColor" />
            {reviewStats.average} average · {reviewStats.count} reviews
          </Sticker>
          <h1 className="mt-6 text-5xl font-bold text-ink md:text-6xl">
            What parents say
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/85 md:text-xl">
            These are reviews of Tic Tac Tooth left by parents on{" "}
            {reviewStats.source}, shown here as they were written. Follow the
            link to read all of them, including any not shown on this page.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/85">
            If your child has been treated at Tic Tac Tooth, a review helps
            other parents far more than anything we can say about ourselves.
          </p>
          <p className="mt-5 inline-block rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream">
            [REAL GOOGLE REVIEWS TO BE SUPPLIED] — cards below are placeholder
            shape and length only
          </p>
        </div>
      </Section>

      <Section tone="mint" size="loose" grain>
        <h2 className="sr-only">Reviews from parents</h2>
        <div className="stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className={`sticker hover-lift relative rounded-3xl p-6 ${
                cardTones[i % cardTones.length]
              }`}
            >
              <Quote className="absolute right-5 top-5 size-8 text-ink/10" aria-hidden="true" />
              <div className="flex gap-0.5 text-gold" aria-hidden="true">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="size-4 fill-current" />
                ))}
              </div>
              <span className="sr-only">{r.rating} out of 5 stars</span>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-ink/85">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm font-bold text-ink">
                {r.name}
                <span className="ml-1 font-normal text-ink/85">· {r.date}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
      <ClosingCta
        title="Come and see the place for yourself."
        body="The rooms are the part that photographs badly and lands well in person."
        cta="Book an appointment"
      />
    </>
  );
}
