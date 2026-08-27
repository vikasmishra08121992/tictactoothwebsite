import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { GridFrame } from "@/components/motifs/grid-frame";
import { Mascot } from "@/components/mascot/mascot";
import { clinic } from "@/lib/content/site";

/**
 * The single closing call-to-action, used at the foot of every page.
 *
 * This replaces the near-identical crimson block that had been copy-pasted
 * across seven pages with drifting copy and button styling. One component
 * means the primary conversion path looks and behaves identically everywhere.
 */
export function ClosingCta({
  title = "Ready when you are.",
  body = "Book online, or reach us the way most parents actually do — a call or a WhatsApp message. All three arrive in the same place.",
  cta = "Book an appointment",
  /** Show the two parallel contact routes as well as the booking button. */
  showContactRoutes = true,
  /** The mascot is dropped on the restrained Teen / Special Needs registers. */
  showMascot = true,
}: {
  title?: string;
  body?: string;
  cta?: string;
  showContactRoutes?: boolean;
  showMascot?: boolean;
}) {
  return (
    <Section tone="crimson" size="loose" grain className="overflow-hidden">
      <GridFrame
        variant="full"
        className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 opacity-15"
        strokeClassName="stroke-white"
      />

      <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="text-white">
          <h2 className="max-w-2xl text-4xl font-bold md:text-6xl">{title}</h2>
          <p className="mt-5 max-w-lg text-lg text-white/90">{body}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink
              href="/book"
              size="lg"
              variant="secondary"
              className="h-14 rounded-full bg-white px-7 text-base font-bold text-crimson-btn shadow-pop hover:bg-cream"
            >
              <CalendarCheck className="size-5" aria-hidden="true" />
              {cta}
            </ButtonLink>

            {showContactRoutes && (
              <>
                <ButtonLink
                  href={clinic.phoneHref}
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full border-2 border-white/70 bg-transparent px-6 text-base text-white hover:bg-white/15"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  Call
                </ButtonLink>
                <ButtonLink
                  href={clinic.whatsappHref}
                  size="lg"
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-14 rounded-full border-2 border-white/70 bg-transparent px-6 text-base text-white hover:bg-white/15"
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                  WhatsApp
                </ButtonLink>
              </>
            )}
          </div>
        </div>

        {showMascot && (
          <Mascot pose="calm" className="mx-auto hidden h-56 w-auto md:block lg:h-72" />
        )}
      </div>
    </Section>
  );
}
