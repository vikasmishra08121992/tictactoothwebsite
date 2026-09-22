import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { treatments, TREATMENT_GROUPS } from "@/lib/content/treatments";

/** The logo's own cell colours, one per group. */
const groupTints: Record<string, string> = {
  "Check-ups & prevention": "bg-mint/35",
  "Fillings & crowns": "bg-lime/35",
  "Advanced dental treatments": "bg-lavender/45",
  "Straightening & jaw growth": "bg-blush/30",
  "Emergencies, extractions & surgery": "bg-coral/25",
  "Comfort & special care": "bg-tangerine/30",
};

/** One line under each group heading, so a parent knows which to open. */
const groupIntro: Record<string, string> = {
  "Check-ups & prevention":
    "The routine visits and protective steps that stop most problems before they start.",
  "Fillings & crowns":
    "Repairing a tooth that has decay or damage, and protecting it afterwards.",
  "Advanced dental treatments":
    "Treatment for a tooth whose nerve is affected, and procedures that go beyond a filling.",
  "Straightening & jaw growth":
    "Guiding how teeth and jaws develop, from early habits through to braces.",
  "Emergencies, extractions & surgery":
    "Injuries, teeth that need to come out, and small surgical procedures.",
  "Comfort & special care":
    "How treatment is made possible for children who cannot manage it the usual way.",
};

/**
 * Every treatment, grouped.
 *
 * A flat grid of twenty-eight cards is a wall; the client said as much with
 * twenty. Grouping under six headings, one of them the client's own
 * "Advanced dental treatments", lets a parent go straight to the row that
 * matches what they were told, without anything being cut from the list.
 *
 * The grid motif from the logo survives as the coloured cells, now one colour
 * per group rather than cycling, so the colour means something.
 */
export function TreatmentsGrid() {
  return (
    <div className="space-y-14">
      {TREATMENT_GROUPS.map((group) => {
        const items = treatments.filter((t) => t.group === group);
        if (items.length === 0) return null;
        const id = group.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        return (
          <section key={group} aria-labelledby={id}>
            <div className="max-w-3xl">
              <h3
                id={id}
                className="font-display text-2xl font-bold text-ink md:text-3xl"
              >
                {group}
                <span className="ml-3 text-base font-normal text-ink/85">
                  {items.length}
                </span>
              </h3>
              <p className="mt-2 text-lg leading-relaxed text-ink/85">
                {groupIntro[group]}
              </p>
            </div>

            <ul className="stagger mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/treatments/${t.slug}`}
                    className={`hover-lift group flex h-full flex-col rounded-3xl p-6 shadow-soft transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                      groupTints[group]
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
                    <span className="mt-2 flex-1 text-base leading-relaxed text-ink/85">
                      {t.shortDescription}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-base font-bold text-crimson-text">
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
          </section>
        );
      })}
    </div>
  );
}
