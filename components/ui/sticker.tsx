import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/*
  Ink on the brand fills, not each colour's `-text` variant. Those variants
  were derived for use ON cream; placed on their own saturated colour they
  land around 3.6:1 and fail AA. Ink clears 5.6:1 or better on every fill
  here — coral is the one exception, so it is lightened to 75% first.
*/
const tones = {
  gold: "bg-gold text-ink",
  mint: "bg-mint text-ink",
  coral: "bg-coral/75 text-ink",
  lavender: "bg-lavender text-ink",
  lime: "bg-lime text-ink",
  tangerine: "bg-tangerine text-ink",
  cream: "bg-cream text-ink",
  ink: "bg-ink text-cream",
} as const;

const tilts = {
  left: "-rotate-3",
  right: "rotate-3",
  none: "",
} as const;

/**
 * A label that reads as something stuck onto the page rather than laid out
 * on it — borrowed from the sticker every child leaves with. Rotation and
 * shadow are stripped in Calm mode.
 */
export function Sticker({
  children,
  tone = "gold",
  tilt = "left",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  tilt?: keyof typeof tilts;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "sticker inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-sm font-bold",
        tones[tone],
        tilts[tilt],
        className
      )}
    >
      {children}
    </span>
  );
}
