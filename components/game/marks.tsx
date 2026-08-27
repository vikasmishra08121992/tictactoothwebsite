import { cn } from "@/lib/utils";

export function MarkX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={cn("h-8 w-8", className)} aria-hidden="true">
      <path
        d="M10 10 C 24 26, 36 34, 50 50"
        stroke="var(--crimson-btn)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 11 C 36 26, 24 35, 9 49"
        stroke="var(--crimson-btn)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function MarkO({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={cn("h-8 w-8", className)} aria-hidden="true">
      <path
        d="M30 8 C 44 8, 52 18, 52 30 C 52 43, 43 52, 30 52 C 17 52, 8 42, 9 29 C 10 17, 18 8, 30 8 Z"
        stroke="var(--teal-text)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
