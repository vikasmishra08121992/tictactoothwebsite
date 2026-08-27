import { MapPin, Clock, ParkingCircle, Navigation } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/section";
import { clinic } from "@/lib/content/site";

export function LocationTeaser() {
  return (
    <Section tone="lime" size="loose" grain>
      <div className="overflow-hidden rounded-3xl bg-white shadow-lift">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <SectionHeading
              eyebrow="Find us"
              title="Maninagar, Ahmedabad"
              description="Trivia One, 302, Kankaria Road — near Lijjat Khaman, Pushpkunj."
            />
            <ul className="mt-7 space-y-4 text-[15px] text-ink/80">
              <li className="flex items-start gap-3">
                <Navigation className="mt-0.5 size-5 shrink-0 text-teal-text" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-ink">Landmark</span>
                  <br />
                  {clinic.landmark} — the fastest way to find us
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-teal-text" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-ink">Timings</span>
                  <br />
                  {clinic.timings}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ParkingCircle className="mt-0.5 size-5 shrink-0 text-teal-text" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-ink">Parking</span>
                  <br />
                  [PLACEHOLDER: parking availability and directions]
                </span>
              </li>
            </ul>
          </div>

          <div className="flex min-h-64 items-center justify-center bg-teal/15 p-8">
            <div className="text-center">
              <MapPin className="mx-auto size-10 text-teal-text" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-teal-text">
                [PLACEHOLDER: embedded map]
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
