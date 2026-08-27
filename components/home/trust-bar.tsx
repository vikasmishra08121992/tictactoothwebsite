import { ShieldCheck, Wind, Accessibility, Clock } from "lucide-react";

/**
 * The four things Tic Tac Tooth offers that a parent is actually deciding on.
 *
 * Each was a two- or three-word label before, which reads as marketing. A
 * parent choosing a dentist for an anxious or disabled child needs to know
 * what the words mean in practice, so each now says what it is rather than
 * that it exists.
 *
 * The wording is deliberately limited to what the client has actually
 * confirmed. An earlier draft of this file described the sterilisation
 * protocol in appealing detail — sealed pouches opened in front of you — which
 * nobody had verified. On a page about a children's hospital, an invented
 * operational claim is not a copywriting flourish; it is a claim a parent may
 * rely on. Anything not confirmed carries a marker instead.
 */
const items = [
  {
    icon: Wind,
    label: "Laughing gas on site",
    detail:
      "Nitrous oxide sedation, administered and monitored by the clinical team, explained to you fully beforehand and used only with your consent. [CLINICAL REVIEW REQUIRED]",
  },
  {
    icon: Accessibility,
    label: "A real special-needs pathway",
    detail:
      "Sensory-friendly slots, longer appointments and no-treatment visits to get used to the room — arranged in advance, not improvised on the day.",
  },
  {
    icon: ShieldCheck,
    label: "Sterilisation you can see",
    detail:
      "There is a dedicated sterilisation area, and the process is shown to any parent who asks. [CONFIRM: the specific protocol — pouching, autoclave cycle and tracking — before describing it in more detail than this.]",
  },
  {
    icon: Clock,
    label: "Unhurried appointments",
    detail:
      "Longer slots are booked where a child needs them, so no part of a visit has to be rushed to keep the day on time.",
  },
];

export function TrustBar() {
  return (
    <div className="wash-deep texture-grain relative border-y border-cream/10 bg-ink">
      <ul className="stagger relative mx-auto grid max-w-[110rem] gap-y-8 px-4 py-12 text-cream sm:grid-cols-2 md:grid-cols-4 md:gap-x-8 md:px-6">
        {items.map(({ icon: Icon, label, detail }) => (
          <li key={label} className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-base font-bold text-cream">
                {label}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-cream/85">
                {detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
