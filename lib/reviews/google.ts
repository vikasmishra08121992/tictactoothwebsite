import "server-only";

/**
 * Google reviews, fetched from the Places API on the server.
 *
 * Why this and not an embed: every review widget on the market injects a
 * third-party script into the page, and this site carries none — a hard rule
 * under DPDP §9 for a site children's parents use. A server-side fetch keeps
 * the browser clean. The API key never leaves the server.
 *
 * What the API gives, and does not:
 *  - The place's overall rating and total review count. Always current.
 *  - Up to five reviews, chosen by Google as "most relevant". Not all of them,
 *    and not selectable. That is a Google limit, not ours, and it is why the
 *    page links out to the full list rather than pretending to be it.
 *
 * Cost: Place Details with the reviews field is a paid SKU with a monthly
 * free allowance. The response is cached for six hours, so a day is four
 * requests and a month is about a hundred and twenty — comfortably inside
 * the free tier.
 *
 * Failure mode is silence. If the key or place ID is missing, or Google is
 * unreachable, the reviews section does not render. The site never shows a
 * placeholder review, a made-up rating, or a stale error.
 *
 * Setup: enable "Places API (New)" on a Google Cloud project, create an API
 * key restricted to that API, find the Place ID for the hospital's Google
 * Business Profile, and set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID.
 */

export type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  /** ISO date the review was published. */
  publishedAt: string;
  /** Google's own relative phrasing, e.g. "2 months ago". */
  relativeTime: string;
};

export type GoogleReviewsSummary = {
  rating: number;
  count: number;
  reviews: GoogleReview[];
  /** Link to the place on Google Maps, where all reviews can be read. */
  mapsUrl: string;
};

type PlaceResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    publishTime?: string;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    authorAttribution?: { displayName?: string };
  }[];
};

const REVALIDATE_SECONDS = 60 * 60 * 6;

export async function getGoogleReviews(): Promise<GoogleReviewsSummary | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          // Ask for exactly the fields used. Billing is per field mask, and a
          // wider mask is both more expensive and more data than needed.
          "X-Goog-FieldMask":
            "rating,userRatingCount,googleMapsUri,reviews.rating,reviews.publishTime,reviews.relativePublishTimeDescription,reviews.text.text,reviews.authorAttribution.displayName",
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!res.ok) return null;
    const data = (await res.json()) as PlaceResponse;
    if (typeof data.rating !== "number" || typeof data.userRatingCount !== "number") {
      return null;
    }

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .filter((r) => r.text?.text && typeof r.rating === "number")
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        rating: r.rating!,
        text: r.text!.text!,
        publishedAt: r.publishTime ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
      }));

    return {
      rating: data.rating,
      count: data.userRatingCount,
      reviews,
      mapsUrl: data.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
    };
  } catch {
    return null;
  }
}

/** DD/MM/YYYY, the site's date format, from an ISO timestamp. */
export function formatReviewDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}
