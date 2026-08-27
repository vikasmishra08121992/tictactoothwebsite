import Image from "next/image";
import { cn } from "@/lib/utils";

const STARS = [
  [12, 22, 1.6], [28, 12, 1], [41, 34, 2.1], [58, 18, 1.2], [72, 30, 1.7],
  [86, 14, 1], [20, 58, 1.3], [35, 72, 1.9], [52, 62, 1.1], [66, 78, 1.5],
  [80, 56, 2], [92, 72, 1.2], [8, 84, 1.4], [46, 88, 1], [74, 92, 1.6],
] as const;

/**
 * Stand-in for the Space room, which has not been photographed yet. Drawn
 * rather than left as a grey box so the layout can still be judged in client
 * review — the glowing disc stands in for the backlit ceiling mural.
 */
export function StarfieldPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("wash-deep relative h-full w-full bg-midnight", className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {STARS.map(([cx, cy, r], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="var(--cream)"
            opacity={0.25 + (i % 4) * 0.18}
          />
        ))}
      </svg>
      <div className="absolute left-1/2 top-[42%] size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-3xl" />
      <div className="absolute left-1/2 top-[42%] size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold/40 bg-gold/10" />
      <p className="absolute inset-x-0 bottom-0 p-4 text-center text-[11px] font-medium leading-snug text-cream/75">
        {label}
      </p>
    </div>
  );
}

/** Renders the room photograph, or the designed stand-in when there isn't one. */
export function RoomMedia({
  src,
  alt,
  sizes = "(min-width: 768px) 50vw, 100vw",
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  if (!src) return <StarfieldPlaceholder label={alt} className={className} />;
  return (
    <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", className)} />
  );
}
