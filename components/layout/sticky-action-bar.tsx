import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { clinic } from "@/lib/content/site";

/**
 * Primary (Book) + two equal-weight parallel actions (Call, WhatsApp),
 * present on every screen per §2 — a parent in India calls or WhatsApps,
 * they do not fill in a form.
 */
export function StickyActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:hidden">
      <div className="grid grid-cols-3">
        <a
          href={clinic.phoneHref}
          className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
        >
          <Phone className="size-5" aria-hidden="true" />
          Call
        </a>
        <a
          href={clinic.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold text-leaf-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          WhatsApp
        </a>
        <Link
          href="/book"
          className="flex min-h-14 flex-col items-center justify-center gap-0.5 bg-primary text-xs font-semibold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        >
          <CalendarCheck className="size-5" aria-hidden="true" />
          Book
        </Link>
      </div>
    </div>
  );
}
