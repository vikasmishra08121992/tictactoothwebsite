import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { treatments } from "@/lib/content/treatments";

/** The logo's own cell colours, cycled across the grid. */
const tints = [
  "bg-coral/25",
  "bg-mint/35",
  "bg-blush/30",
  "bg-lime/35",
  "bg-lavender/45",
  "bg-tangerine/30",
];

/**
 * Every treatment in one grid.
 *
 * This replaced a literal 3×3 tic-tac-toe board: the board could only hold
 * nine, which forced the rest into a second "more treatments" list. The
 * client wanted one list showing everything, so the grid motif survives as
 * the coloured cells and crossing rules rather than as a nine-cell cap.
 */
export function TreatmentsGrid() {
  return (
    <ul className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {treatments.map((t, i) => (
        <li key={t.slug}>
          <Link
            href={`/treatments/${t.slug}`}
            className={`hover-lift group flex h-full flex-col rounded-3xl p-6 shadow-soft transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              tints[i % tints.length]
            }`}
          >
            {t.teenRelevant && (
              <span className="mb-3 inline-flex w-fit rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cream">
                Teens
              </span>
            )}
            <span className="font-display text-xl font-bold leading-tight text-ink">
              {t.name}
            </span>
            <span className="mt-2 flex-1 text-sm leading-relaxed text-ink/85">
              {t.shortDescription}
            </span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-crimson-text">
              Read more
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
