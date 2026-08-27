import Link from "next/link";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { clinic } from "@/lib/content/site";

/*
  One link column, not three. The footer previously repeated ten links that
  all appear in the header already — the only genuinely footer-specific
  destinations are the ones a person looks *down* for.
*/
const footerLinks = [
  { label: "Dental Emergency", href: "/emergency" },
  { label: "Book an Appointment", href: "/book" },
  { label: "Contact & Location", href: "/contact" },
  { label: "Special Needs & Inclusive Care", href: "/special-needs" },
  { label: "Privacy Notice", href: "/privacy" },
  { label: "All screens (mockup index)", href: "/mockups" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-gold bg-ink pb-24 text-cream md:pb-10">
      <div className="mx-auto grid max-w-[110rem] gap-12 px-4 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:px-6">
        <div>
          <Logo invert />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/75">
            {clinic.name} is a single-location paediatric dental hospital in
            Maninagar, Ahmedabad. It treats children and teenagers only, from a
            baby&apos;s first tooth to their eighteenth birthday, including full
            sensory-friendly and special-needs pathways.
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-gold">
            Visit &amp; contact
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-cream/85">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
              <span>
                {clinic.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
              {clinic.timings}
            </li>
            <li>
              <a
                href={clinic.phoneHref}
                className="inline-flex min-h-11 items-center gap-2.5 font-semibold hover:underline"
              >
                <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
                {clinic.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={clinic.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2.5 font-semibold hover:underline"
              >
                <MessageCircle className="size-4 shrink-0 text-gold" aria-hidden="true" />
                WhatsApp us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-gold">
            Quick links
          </h2>
          <ul className="mt-5 space-y-1 text-sm">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-cream/85 hover:text-cream hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15 px-4 py-6 text-center text-xs text-cream/60 md:px-6">
        <p>
          © {new Date().getFullYear()} {clinic.fullName}, Maninagar, Ahmedabad.
          Information on this site is general guidance, not a diagnosis, and no
          claim of a guaranteed outcome is made or implied. Not yet live —
          pending clinical and legal review.
        </p>
      </div>
    </footer>
  );
}
