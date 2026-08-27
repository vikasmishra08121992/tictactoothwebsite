import type { Metadata } from "next";
import {
  Sparkles,
  Candy,
  Baby,
  Hand,
  Smile,
  Siren,
  HeartHandshake,
  CalendarClock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section } from "@/components/layout/section";
import { Sticker } from "@/components/ui/sticker";
import { parentTopics } from "@/lib/content/for-parents";

export const metadata: Metadata = {
  title: "For Parents",
  description:
    "Plain answers from Tic Tac Tooth on first visits, brushing by age, sugar and diet, teething, dental injuries, anxious children, thumb-sucking and orthodontic assessments.",
};

/**
 * Icons live here rather than in the content module, so the content stays a
 * plain data file with no React dependency.
 */
const ICONS: Record<string, typeof Sparkles> = {
  "first-visit": Smile,
  "baby-teeth": Baby,
  brushing: Sparkles,
  sugar: Candy,
  teething: Baby,
  injury: Siren,
  anxious: HeartHandshake,
  thumb: Hand,
  orthodontics: Smile,
  frequency: CalendarClock,
};

export default function ForParentsPage() {
  return (
    <>
      <Section tone="wash" size="loose" grain>
        <div className="mx-auto max-w-3xl text-center">
          <Sticker tone="lavender" tilt="left">
            Everyday questions
          </Sticker>
          <h1 className="mt-6 text-5xl font-bold text-ink md:text-6xl">
            For Parents
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/85 md:text-xl">
            The questions parents ask Tic Tac Tooth most often, answered in plain language rather than clinical shorthand. If yours is not here, ask us on the phone or on WhatsApp — nothing is too small a question.
          </p>
        </div>
      </Section>

      <Section tone="lavender" size="loose" grain>
        <h2 className="sr-only">Common questions from parents</h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {parentTopics.map((t, i) => {
            const Icon = ICONS[t.id] ?? Smile;
            return (
              <Accordion
                key={t.id}
                className="overflow-hidden rounded-2xl bg-white px-5 shadow-soft"
              >
                <AccordionItem value={`item-${i}`} className="border-0">
                  <AccordionTrigger className="py-5 text-left">
                    <span className="flex items-start gap-3.5 pr-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint/30 text-mint-text">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-display text-lg font-bold text-ink">
                          {t.q}
                        </span>
                        {/* The one-line answer sits in the closed state, so a
                            parent scanning gets an answer without opening
                            anything. */}
                        <span className="mt-1 block text-sm leading-relaxed text-ink/85">
                          {t.short}
                        </span>
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-[3.375rem]">
                    <div className="space-y-3 leading-relaxed text-ink/85">
                      {t.detail.map((para) => (
                        <p key={para.slice(0, 32)}>{para}</p>
                      ))}
                      {t.clinical && (
                        <p className="rounded-xl bg-cream px-3 py-2 text-xs font-semibold text-ink">
                          [CLINICAL REVIEW REQUIRED] — general guidance, not a
                          diagnosis. Bring anything specific to an appointment.
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </Section>
      <ClosingCta
        title="Something more specific to your child?"
        body="General guidance only goes so far. Bring the question to an appointment and we'll answer it properly."
        cta="Book an appointment"
      />
    </>
  );
}
