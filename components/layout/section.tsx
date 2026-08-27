import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { GridFrame } from "@/components/motifs/grid-frame";

/*
  Colour-blocking is the main brightness lever. The brand fills are used at
  full or near-full strength as section grounds rather than as 15–25% tints —
  ink clears 7:1 or better on every one of them, so the page can be genuinely
  colourful without costing legibility.
*/
const tones = {
  cream: "bg-cream text-ink",
  white: "bg-white text-ink",
  ink: "bg-ink text-cream",
  midnight: "bg-midnight text-cream",
  wash: "bg-cream text-ink wash-warm",
  mint: "bg-mint text-ink",
  blush: "bg-blush text-ink",
  lavender: "bg-lavender text-ink",
  lime: "bg-lime text-ink",
  tangerine: "bg-tangerine/85 text-ink",
  gold: "bg-gold text-ink",
  greige: "bg-greige/25 text-ink",
  crimson: "bg-crimson-btn text-white",
} as const;

/**
 * Section shell. `tone` does the colour-blocking that keeps the page from
 * being an unbroken field of cream, and `grain` adds paper texture so large
 * flat colour fields don't read as plastic.
 */
export function Section({
  children,
  className,
  containerClassName,
  id,
  tone = "cream",
  size = "default",
  grain = false,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  tone?: keyof typeof tones;
  size?: "default" | "tight" | "loose";
  grain?: boolean;
}) {
  const pad =
    size === "tight"
      ? "py-12 md:py-16"
      : size === "loose"
        ? "py-20 md:py-32"
        : "py-16 md:py-24";

  return (
    <section
      id={id}
      className={cn(
        "relative px-4 md:px-6",
        pad,
        tones[tone],
        grain && "texture-grain",
        className
      )}
    >
      <div className={cn("relative mx-auto max-w-[110rem]", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/**
 * Section heading. The eyebrow carries a hand-drawn grid mark rather than a
 * bullet or a rule — the motif doing real work at small scale.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  invert = false,
  size = "default",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** For use on ink / midnight / crimson tones. */
  invert?: boolean;
  size?: "default" | "large";
  /** Pass "h1" when this heading is the page title — every page needs one. */
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]",
            align === "center" && "justify-center",
            invert ? "text-gold" : "text-ink"
          )}
        >
          <GridFrame
            variant="accent"
            className="h-4 w-9 shrink-0"
            strokeClassName={invert ? "stroke-gold" : "stroke-teal-text"}
          />
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "font-bold",
          size === "large"
            ? "text-4xl md:text-6xl"
            : "text-3xl md:text-5xl",
          invert ? "text-cream" : "text-ink"
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-lg leading-relaxed md:text-xl",
            align === "center" && "mx-auto",
            invert ? "text-cream/80" : "text-ink/85"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
