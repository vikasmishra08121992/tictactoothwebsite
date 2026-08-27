import type { Metadata } from "next";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ParkingCircle,
  Accessibility,
  Navigation,
} from "lucide-react";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { Sticker } from "@/components/ui/sticker";
import { clinic } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact & Location",
  description:
    "How to find Tic Tac Tooth Kids Dental Hospital — Trivia One, 302, Kankaria Road, near Lijjat Khaman, Pushpkunj, Maninagar, Ahmedabad. Timings, parking, WhatsApp and accessibility of the premises.",
};

/**
 * The practical questions someone asks before setting off.
 *
 * Each entry has a short value and, where it helps, a line of detail. A
 * landmark is more useful than a pin in Maninagar, where street addresses are
 * often approximate and everyone navigates by what is on the corner.
 */
const details = [
  {
    icon: Navigation,
    label: "Landmark",
    value: clinic.landmark,
    detail:
      "The fastest way to find Tic Tac Tooth is to head for Lijjat Khaman on Kankaria Road and look for the backlit gold sign beside the wood-slat door. Auto drivers know the landmark even when they do not know the building.",
  },
  {
    icon: Clock,
    label: "Timings",
    value: clinic.timings,
    detail:
      "Closed on Sundays. There is a break in the middle of the day — the booking form only ever offers times the clinic is actually open, so anything you can select is genuinely available.",
  },
  {
    icon: ParkingCircle,
    label: "Parking",
    value: "[PLACEHOLDER: parking availability and directions]",
    detail:
      "[PLACEHOLDER: whether there is dedicated parking, where to leave a car or two-wheeler, and how far the walk is with a pushchair.]",
  },
  {
    icon: Accessibility,
    label: "Accessibility",
    value:
      "[CONFIRM: wheelchair access to the entrance, treatment rooms and washrooms]",
    detail:
      "[CONFIRM: lift or stairs to the second floor, door widths, and whether a wheelchair can be transferred beside the dental chair. Please tell the client this is the single most-asked question by parents of disabled children and must be answered precisely rather than reassuringly.]",
  },
];

export default function ContactPage() {
  return (
    <>
      <Section tone="wash" size="loose" grain>
        <div className="mx-auto max-w-3xl text-center">
          <Sticker tone="mint" tilt="left">
            Maninagar, Ahmedabad
          </Sticker>
          <h1 className="mt-6 text-5xl font-bold text-ink md:text-6xl">
            Come and find us.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/85 md:text-xl">
            Trivia One, 302, Kankaria Road — near Lijjat Khaman, Pushpkunj.
          </p>
        </div>
      </Section>

      <Section tone="mint" size="loose" grain>
        <div className="overflow-hidden rounded-3xl bg-white shadow-lift">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="font-display text-2xl font-bold text-ink">
                Visit &amp; contact
              </h2>

              <address className="mt-6 not-italic">
                <span className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-teal-text" aria-hidden="true" />
                  <span className="text-[15px] leading-relaxed text-ink/85">
                    {clinic.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </span>
              </address>

              {/* dt/dd must be direct children of the <dl> or of one <div>
                  wrapper, so the icon spans rows in a grid rather than sitting
                  in an extra nesting level. */}
              <dl className="mt-7 space-y-5">
                {details.map(({ icon: Icon, label, value, detail }) => (
                  <div
                    key={label}
                    className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5"
                  >
                    <Icon
                      className="row-span-2 mt-0.5 size-5 shrink-0 text-teal-text"
                      aria-hidden="true"
                    />
                    <dt className="text-sm font-bold text-ink">{label}</dt>
                    <dd className="text-[15px] leading-relaxed text-ink/85">
                      {value}
                      {detail && (
                        <span className="mt-1 block text-sm text-ink/85">
                          {detail}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={clinic.phoneHref}
                  size="lg"
                  className="h-13 rounded-full px-6 text-base shadow-pop"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  Call the clinic
                </ButtonLink>
                <ButtonLink
                  href={clinic.whatsappHref}
                  size="lg"
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-13 rounded-full border-2 border-leaf-text bg-transparent px-6 text-base text-leaf-text hover:bg-leaf-text hover:text-white"
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                  WhatsApp us
                </ButtonLink>
              </div>
            </div>

            <div className="flex min-h-72 items-center justify-center bg-teal/15 p-8 lg:min-h-full">
              <div className="text-center">
                <MapPin className="mx-auto size-10 text-teal-text" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-teal-text">
                  [PLACEHOLDER: embedded map centred on Maninagar]
                </p>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-ink/85">
                  A map embed is a third-party request — see DECISIONS.md before
                  adding one, given the children&apos;s-data constraints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <ClosingCta
        title="Prefer to book online?"
        body="Book online, or reach us the way most parents actually do — a call or a WhatsApp message."
        cta="Book an appointment"
      />
    </>
  );
}
