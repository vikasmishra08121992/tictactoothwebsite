import { cn } from "@/lib/utils";

type GridFrameProps = {
  /**
   * "full"   — all four crossing rules, a real 3×3 board.
   * "accent" — a single crossing pair, as a section divider mark.
   * "cells"  — the board plus the logo's coloured cells behind it.
   */
  variant?: "full" | "accent" | "cells";
  className?: string;
  strokeClassName?: string;
};

/**
 * The logo's hand-drawn tic-tac-toe grid. Used structurally (treatments
 * board, 404 game) and decoratively (section marks, background motif).
 * Suppressed in Calm mode and in the Teen / Special Needs registers.
 *
 * The rules are deliberately imperfect — slight bow and overshoot, matching
 * the marker lettering in the logo. A geometrically perfect grid reads as a
 * spreadsheet.
 */
export function GridFrame({
  variant = "full",
  className,
  strokeClassName = "stroke-ink",
}: GridFrameProps) {
  if (variant === "accent") {
    return (
      <svg
        viewBox="0 0 120 44"
        className={cn("h-9 w-24", className)}
        aria-hidden="true"
      >
        <path
          d="M42 5 C39.5 16, 44 29, 40.5 39"
          className={strokeClassName}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M5 22 C31 19.5, 62 24.5, 115 21"
          className={strokeClassName}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 300 300"
      className={cn("", className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {variant === "cells" && (
        <g opacity="0.9">
          <rect x="6" y="6" width="88" height="88" rx="12" fill="var(--coral)" />
          <rect x="206" y="6" width="88" height="88" rx="12" fill="var(--mint)" />
          <rect x="106" y="106" width="88" height="88" rx="12" fill="var(--lavender)" />
          <rect x="6" y="206" width="88" height="88" rx="12" fill="var(--lime)" />
          <rect x="206" y="206" width="88" height="88" rx="12" fill="var(--tangerine)" />
        </g>
      )}
      <path
        d="M100 8 C95.5 90, 104.5 200, 98 294"
        className={strokeClassName}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M202 6 C197 100, 206.5 190, 200 296"
        className={strokeClassName}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M6 100 C100 95.5, 200 104.5, 294 98"
        className={strokeClassName}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M4 202 C100 197, 200 206.5, 296 200"
        className={strokeClassName}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
