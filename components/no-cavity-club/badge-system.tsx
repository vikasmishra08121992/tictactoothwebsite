import { Star } from "lucide-react";
import { badges } from "@/lib/content/no-cavity-club";

/**
 * The six badges, each with what it takes to earn it.
 *
 * Previously a row of coloured circles with a name under each, which looked
 * like a design and worked like nothing: a child could not tell what to do to
 * earn one and a parent could not tell what any of them measured. The badge is
 * still the visual anchor; the two lines beneath it are what make the page
 * useful.
 */
export function BadgeSystem() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {badges.map((b) => (
        <li
          key={b.name}
          className="flex gap-4 rounded-2xl border border-ink/10 bg-white p-5"
        >
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-ink/10"
            style={{ backgroundColor: `var(--${b.color})` }}
            aria-hidden="true"
          >
            <Star
              className="size-6 text-ink/85"
              fill="currentColor"
              fillOpacity={0.15}
            />
          </span>

          <div className="min-w-0">
            <h3 className="font-display text-base font-bold text-ink">
              {b.name}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink/85">
              {b.howToEarn}
            </p>
            <p className="mt-2 border-t border-ink/10 pt-2 text-sm leading-relaxed text-ink/85">
              <span className="font-semibold text-ink">Why it matters: </span>
              {b.whyItMatters}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
