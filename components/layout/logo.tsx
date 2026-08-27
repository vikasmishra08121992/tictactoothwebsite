import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The client's supplied logo artwork. It contains the wordmark itself
 * ("TIC TAC TOOTH") but not the "Kids Dental Hospital" descriptor, so that
 * line is set in type alongside it.
 *
 * See DECISIONS.md — the supplied "SVG" is a raster PNG in an SVG wrapper,
 * not a true vector, so this is a PNG master with Next/Image deriving the
 * responsive sizes.
 */
export function Logo({
  className,
  size = "default",
  invert = false,
}: {
  className?: string;
  size?: "default" | "large";
  /** For dark grounds — flips the descriptor line to cream. */
  invert?: boolean;
}) {
  const dims = size === "large" ? "h-20" : "h-14";

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className
      )}
    >
      <Image
        src="/images/brand/logo.png"
        alt="Tic Tac Tooth"
        width={640}
        height={614}
        priority
        className={cn("w-auto object-contain", dims)}
      />
      <span
        className={cn(
          "whitespace-nowrap text-[10px] font-bold uppercase leading-tight tracking-[0.14em]",
          invert ? "text-cream/75" : "text-greige-text"
        )}
      >
        Kids Dental
        <br />
        Hospital
      </span>
    </Link>
  );
}
