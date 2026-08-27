"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { milestones } from "@/lib/content/growing-up";

export function HeightChartRail() {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const maxCm = 190;

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll to earlier ages"
          className="flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll to later ages"
          className="flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* A horizontally scrollable region has to be reachable and scrollable
          by keyboard alone, so it takes focus and is labelled as a group. */}
      <div
        ref={railRef}
        tabIndex={0}
        role="group"
        aria-label="Dental milestones from birth to age 18, scroll horizontally"
        className="flex gap-5 overflow-x-auto pb-6 pl-1 pr-6 [scroll-snap-type:x_mandatory] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {milestones.map((m) => (
          <article
            key={m.title}
            className="flex w-80 shrink-0 flex-col rounded-2xl border border-ink/10 bg-white p-5 [scroll-snap-align:start]"
          >
            <div className="mb-3 h-2 w-full rounded-full bg-ink/5">
              <div
                className="h-2 rounded-full bg-teal"
                style={{ width: `${Math.min(100, (m.cm / maxCm) * 100)}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-text">
              {m.age} · ~{m.cm}cm
            </p>
            <h3 className="mt-1 font-semibold text-ink">{m.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/85">{m.body}</p>

            {/* The two lines that make the timeline actionable rather than
                merely informative: what to do, and what usually goes wrong. */}
            <div className="mt-3 space-y-2 border-t border-ink/10 pt-3">
              <p className="text-sm leading-relaxed text-ink/85">
                <span className="font-semibold text-ink">What to do: </span>
                {m.whatToDo}
              </p>
              <p className="text-sm leading-relaxed text-ink/85">
                <span className="font-semibold text-ink">Watch for: </span>
                {m.watchFor}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
