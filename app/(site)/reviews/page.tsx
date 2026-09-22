import type { Metadata } from "next";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section } from "@/components/layout/section";
import { GoogleRatingLine, GoogleReviewCards } from "@/components/reviews/google-reviews";
import { getGoogleReviews } from "@/lib/reviews/google";
import { clinic } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Reviews of Tic Tac Tooth Kids Dental Hospital, Maninagar, Ahmedabad, as posted by parents on Google.",
};

export const revalidate = 21600;

/**
 * Reviews come from Google, or the page says so and links out.
 *
 * There are no placeholder reviews. The earlier version of this page rendered
 * three cards of bracketed filler to show what the layout would look like,
 * which looked like exactly what it was. If Google cannot be reached, or the
 * integration is not configured, the page shows one honest paragraph and a
 * link to the profile, and nothing else.
 */
export default async function ReviewsPage() {
  const summary = await getGoogleReviews();

  return (
    <>
      <Section tone="white" size="loose">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-ink md:text-5xl lg:text-6xl">
            What parents say
          </h1>
          <p className="mt-6 text-xl text-ink/85">
            These are reviews of {clinic.name} as parents wrote them on Google.
            We do not edit them, and we cannot choose which ones appear here.
            Google shows the five it considers most relevant; the full list is
            one click away.
          </p>
          {summary && <GoogleRatingLine summary={summary} className="mt-6" />}
        </div>
      </Section>

      {summary ? (
        <Section tone="tint" size="loose">
          <h2 className="sr-only">Recent reviews</h2>
          <div className="mx-auto max-w-[86rem]">
            <GoogleReviewCards summary={summary} />
            <p className="mt-8 text-base text-ink/85">
              <a
                href={summary.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink underline underline-offset-4"
              >
                Read all {summary.count} reviews on Google
              </a>
            </p>
          </div>
        </Section>
      ) : (
        <Section tone="tint" size="default">
          <div className="mx-auto max-w-3xl">
            <p className="text-lg text-ink/85">
              Reviews are published on our Google Business Profile. Search for{" "}
              <strong className="text-ink">{clinic.fullName}</strong> on Google
              Maps to read them.
            </p>
            {/* [PLACEHOLDER: set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID to
                pull reviews in automatically; until then this paragraph is
                what renders.] */}
          </div>
        </Section>
      )}

      <ClosingCta
        title="Come and see the rooms in person."
        body="Photographs show the murals. They do not show a four-year-old choosing which one to sit in."
        cta="Book an appointment"
      />
    </>
  );
}
