import { ArrowRight, Star, Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { reviews } from "@/lib/content/reviews";

const cardTones = [
  "bg-blush/25 rotate-[-1.2deg]",
  "bg-mint/30 rotate-[0.8deg]",
  "bg-lime/25 rotate-[-0.6deg]",
];

export function ReviewsPreview() {
  return (
    <Section tone="white" size="loose">
      <SectionHeading
        eyebrow="What parents say"
        size="large"
        title="Reviews"
        description="[REAL GOOGLE REVIEWS TO BE SUPPLIED] — the cards below are placeholder length and shape only."
        align="center"
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className={`sticker relative rounded-3xl p-6 ${cardTones[i % cardTones.length]}`}
          >
            <Quote
              className="absolute right-5 top-5 size-8 text-ink/10"
              aria-hidden="true"
            />
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

      <div className="mt-10 flex justify-center">
        <ButtonLink
          href="/reviews"
          variant="outline"
          size="lg"
          className="h-13 rounded-full border-2 border-ink bg-transparent px-6 text-base text-ink hover:bg-ink hover:text-cream"
        >
          Read more reviews
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </Section>
  );
}
