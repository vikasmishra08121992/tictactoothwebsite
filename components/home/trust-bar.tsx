import { ShieldCheck, Wind, Accessibility, Clock } from "lucide-react";
import { cleanContent } from "@/lib/content/clean";

/*
  The four things a parent is actually choosing on. Each says what it means
  in practice. Wording is limited to what the client has confirmed; anything
  not confirmed carries a marker in the source, stripped before render.
*/
const RAW_ITEMS = [
  {
    icon: Wind,
    label: "Laughing gas on site",
    detail:
      "Nitrous oxide sedation, given and monitored by the clinical team. It is explained to you fully first and used only with your consent. [CLINICAL REVIEW REQUIRED]",
  },
  {
    icon: Accessibility,
    label: "A real special-needs pathway",
    detail:
      "Sensory-friendly slots, longer appointments and no-treatment visits to get used to the room, arranged in advance rather than improvised on the day.",
  },
  {
    icon: ShieldCheck,
    label: "Sterilisation you can see",
    detail:
      "There is a dedicated sterilisation area, and the process is shown to any parent who asks. [CONFIRM: the specific protocol before describing it in more detail than this.]",
  },
  {
    icon: Clock,
    label: "Unhurried appointments",
    detail:
      "Longer slots are booked where a child needs them, so no part of a visit is rushed to keep the day on time.",
  },
];

const items = RAW_ITEMS.map((i) => ({ ...i, detail: cleanContent(i.detail) }));

export function TrustBar() {
  return (
    <div className="wash-deep texture-grain relative border-y border-cream/10 bg-ink">
      <ul className="stagger relative mx-auto grid max-w-[110rem] gap-y-8 px-4 py-14 text-cream sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 md:px-6">
        {items.map(({ icon: Icon, label, detail }) => (
          <li key={label} className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-lg font-bold text-cream">
                {label}
              </span>
              <span className="mt-1 block text-base text-cream/85">{detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
