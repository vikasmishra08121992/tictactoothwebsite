import { clinic } from "@/lib/content/site";

export type Badge = {
  name: string;
  color: string;
  /** What a child has to do to earn it — the whole point of a reward scheme. */
  howToEarn: string;
  /** Why it is worth earning, addressed to the parent. */
  whyItMatters: string;
};

/**
 * The No Cavity Club.
 *
 * The badges previously had names and colours and nothing else, which made the
 * page decorative rather than useful: a child could not tell what to do to earn
 * one, and a parent could not tell what any of them measured.
 *
 * Each badge now says how it is earned and why it is worth earning. That
 * second line is deliberately aimed at the parent — a reward scheme only works
 * if the adult at home understands what is being encouraged and keeps it going
 * between visits.
 */
export const badges: Badge[] = [
  {
    name: "First Visit",
    color: "coral",
    howToEarn: `Given to every child at the end of their very first appointment at ${clinic.name}, whatever happened in the chair.`,
    whyItMatters:
      "It is earned for turning up and sitting down, not for being brave or staying still. A child who leaves their first visit having succeeded at something is far easier to bring back.",
  },
  {
    name: "Brave Smile",
    color: "mint",
    howToEarn:
      "Earned for getting through a treatment that felt hard — a filling, an extraction, or simply managing a check-up that was frightening last time.",
    whyItMatters:
      "It names the effort rather than the outcome. A child who cried but stayed in the chair has done something genuinely difficult, and that deserves recognising.",
  },
  {
    name: "No Cavities",
    color: "gold",
    howToEarn:
      "Earned at a check-up where no new decay is found since the previous visit.",
    whyItMatters:
      "The headline badge of the club. It rewards the months of brushing between appointments rather than anything that happens on the day.",
  },
  {
    name: "Brushing Streak",
    color: "lavender",
    howToEarn:
      "Earned by filling in the brushing chart at home — twice a day, morning and night, for a full week without a gap.",
    whyItMatters:
      "Brushing is a habit, not an event. A visible streak that would be a shame to break is one of the few things that reliably gets a tired six-year-old to the sink at bedtime.",
  },
  {
    name: "Six-Month Star",
    color: "lime",
    howToEarn:
      "Earned by coming back for a routine check-up roughly six months after the last one.",
    whyItMatters:
      "Most childhood decay is cheap and painless to treat when it is caught at six-monthly intervals, and expensive and frightening when it is not. This badge rewards the parent as much as the child.",
  },
  {
    name: "Sealant Squad",
    color: "tangerine",
    howToEarn:
      "Earned when a child has fissure sealants placed on their first permanent molars — usually around age six or seven.",
    whyItMatters:
      "Sealants fill the deep grooves on the biting surface where a toothbrush bristle cannot reach. Having them placed is a decision the parent makes, so the badge marks a preventive step rather than a treatment. [CLINICAL REVIEW REQUIRED]",
  },
];

export const brushingDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/**
 * How the club actually works, in the order a parent would ask.
 *
 * [CONFIRM] Every operational detail here — whether cards are physical, what
 * happens when a card is full, whether there is any prize — must be confirmed
 * by the client before launch. The wording below describes the scheme as it
 * has been designed, not as it has been verified to run.
 */
export const howTheClubWorks = [
  {
    q: "Does it cost anything to join?",
    a: `No. Every child treated at ${clinic.name} is in the club automatically from their first visit. There is nothing to sign up for and nothing to pay.`,
  },
  {
    q: "How does my child collect badges?",
    a: "[CONFIRM: whether badges are recorded on a physical card kept at reception, a card the child takes home, or both.] Badges are awarded at the end of an appointment, and the brushing chart is filled in at home between visits.",
  },
  {
    q: "What happens when the card is full?",
    a: "[CONFIRM: what a completed card earns — the reward, if any, and whether a new card is started.]",
  },
  {
    q: "My child had a cavity. Are they out of the club?",
    a: "Not at all. Cavities happen, including to children who brush well — enamel strength, diet, medication and saliva all play a part. The club rewards the habits that reduce the risk, and every other badge is still there to earn.",
  },
  {
    q: "Is this just a sticker chart?",
    a: "In part, deliberately. A child who associates the dentist with a small, reliable, achievable reward arrives less anxious next time, and an anxious child is harder and slower to treat safely. The habits it encourages — twice-daily brushing and six-monthly check-ups — are the two that make the most difference to a child's teeth.",
  },
];
