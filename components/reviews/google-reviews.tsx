import { Star } from "lucide-react";
import { formatReviewDate, type GoogleReviewsSummary } from "@/lib/reviews/google";

function Stars({ rating, size = "size-4" }: { rating: number; size?: string }) {
  return (
    <span className="inline-flex gap-0.5 text-gold" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={size}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          strokeWidth={i < Math.round(rating) ? 0 : 1.5}
        />
      ))}
    </span>
  );
}

/** The rating line, "4.8 from 132 Google reviews", linking to the full list. */
export function GoogleRatingLine({
  summary,
  className = "",
}: {
  summary: GoogleReviewsSummary;
  className?: string;
}) {
  return (
    <a
      href={summary.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center gap-2 text-base font-semibold text-ink underline-offset-4 hover:underline ${className}`}
    >
      <Stars rating={summary.rating} />
      <span>
        {summary.rating.toFixed(1)} from {summary.count} Google reviews
      </span>
      <span className="sr-only">(opens Google Maps in a new tab)</span>
    </a>
  );
}

/**
 * Review cards, as written.
 *
 * Nothing here is styled to look better than it is: no tilt, no quote marks
 * the size of a fist, no pastel tint per card. A name, a rating, the words,
 * the date, and where it was posted. Trust comes from the reader being able
 * to click through and find the same review on Google.
 */
export function GoogleReviewCards({ summary }: { summary: GoogleReviewsSummary }) {
  if (summary.reviews.length === 0) return null;

  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {summary.reviews.map((r, i) => (
        <li key={`${r.author}-${r.publishedAt}-${i}`}>
          <figure className="flex h-full flex-col rounded-2xl border border-tint-line bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <figcaption className="font-semibold text-ink">{r.author}</figcaption>
              <Stars rating={r.rating} />
              <span className="sr-only">{r.rating} out of 5 stars</span>
            </div>
            <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink/85">
              {r.text}
            </blockquote>
            <p className="mt-5 text-sm text-ink/85">
              Posted on Google
              {r.publishedAt && `, ${formatReviewDate(r.publishedAt)}`}
            </p>
          </figure>
        </li>
      ))}
    </ul>
  );
}
