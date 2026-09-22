import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The client's supplied logo artwork. It contains the wordmark itself
 * ("TIC TAC TOOTH") but not the "Kids Dental Hospital" descriptor, so that
 * line is set in type alongside it.
 *
 * See DECISIONS.md, the supplied "SVG" is a raster PNG in an SVG wrapper,
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
  /** For dark grounds, flips the descriptor line to cream. */
  invert?: boolean;
}) {
  const dims = size === "large" ? "h-20" : "h-14";
  // The mark is 640x614, so h-20 renders 83px wide and h-14 renders 58px.
  // Without this the browser assumes it may need the full intrinsic width and
  // pulls a 640px master into a 58px box, on the critical path, on every page.
  const renderedWidth = size === "large" ? "84px" : "59px";

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
        sizes={renderedWidth}
        // `priority` is deprecated in Next 16. This sits in the header above
        // the fold but is never the LCP element, so eager loading is right
        // here and a <head> preload would only compete with the real one.
        loading="eager"
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
