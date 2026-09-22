import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { GoogleRatingLine, GoogleReviewCards } from "@/components/reviews/google-reviews";
import { getGoogleReviews } from "@/lib/reviews/google";

/**
 * Home-page reviews. Renders only when real reviews are available, a home
 * page with an empty "what parents say" section is worse than one without
 * the section at all.
 */
export async function ReviewsPreview() {
  const summary = await getGoogleReviews();
  if (!summary || summary.reviews.length === 0) return null;

  return (
    <Section tone="white" size="loose">
      <SectionHeading size="large" title="What parents say" align="center" />
      <div className="mt-4 flex justify-center">
        <GoogleRatingLine summary={summary} />
      </div>

      <div className="mt-12">
        <GoogleReviewCards summary={{ ...summary, reviews: summary.reviews.slice(0, 3) }} />
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
