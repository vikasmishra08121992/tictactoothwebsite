import { MapPin, Clock, Navigation, Phone, ExternalLink } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/section";
import { clinic } from "@/lib/content/site";

/** A Google Maps search for the hospital. A link, not an embed: an embedded
 *  map loads Google's scripts and cookies into a page parents use, and the
 *  site carries no third-party scripts. */
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${clinic.fullName}, ${clinic.addressLines.join(", ")}`
)}`;

export function LocationTeaser() {
  return (
    <Section tone="mint" size="loose">
      <div className="overflow-hidden rounded-3xl border border-tint-line">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <SectionHeading
              eyebrow="Find us"
              title="Maninagar, Ahmedabad"
              description={clinic.addressLines.join(", ")}
            />
            <ul className="mt-7 space-y-5 text-lg text-ink/85">
              <li className="flex items-start gap-3">
                <Navigation className="mt-1 size-5 shrink-0 text-teal-text" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-ink">Landmark</span>
                  {clinic.landmark}. Auto drivers know the landmark even when
                  they do not know the building.
                </span>
              </li>
              {clinic.timings && (
                <li className="flex items-start gap-3">
                  <Clock className="mt-1 size-5 shrink-0 text-teal-text" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-ink">Timings</span>
                    {clinic.timings}
                  </span>
                </li>
              )}
              <li className="flex items-start gap-3">
                <Phone className="mt-1 size-5 shrink-0 text-teal-text" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-ink">Phone and WhatsApp</span>
                  <a
                    href={clinic.phoneHref}
                    className="underline underline-offset-4 hover:text-ink"
                  >
                    {clinic.phoneDisplay}
                  </a>
                </span>
              </li>
              {/* [PLACEHOLDER: parking, whether there is dedicated parking,
                  where to leave a car or two-wheeler, and the walk with a
                  pushchair. Shown only once the client confirms.] */}
            </ul>
          </div>

          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-64 flex-col items-center justify-center gap-3 bg-tint p-8 text-center transition-colors hover:bg-tint-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <MapPin className="size-10 text-teal-text" aria-hidden="true" />
            <span className="inline-flex items-center gap-2 text-lg font-semibold text-ink">
              Open in Google Maps
              <ExternalLink className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base text-ink/85">Directions from wherever you are</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
