export type Milestone = {
  age: string;
  cm: number;
  title: string;
  body: string;
  /** What a parent should actually do at this stage. */
  whatToDo: string;
  /** The thing most often got wrong or worried about at this age. */
  watchFor: string;
};

/**
 * The dental timeline from birth to eighteen.
 *
 * Mirrors reception's 40–230cm jungle-animal height chart — a child can find
 * their own height on the wall and see what is happening in their mouth.
 *
 * Each stage now answers three questions rather than one: what is happening,
 * what the parent should do about it, and what to watch for. A timeline that
 * only describes is interesting; one that tells a parent what to do next is
 * useful, and this is the page parents are most likely to read at 11pm while
 * worrying about something they noticed at bedtime.
 *
 * [CLINICAL REVIEW REQUIRED] Eruption ages and guidance are typical ranges,
 * not diagnosis. Every child differs, and the whole timeline must be reviewed
 * by the treating dentist before this page goes live.
 */
export const milestones: Milestone[] = [
  {
    age: "0–6 months",
    cm: 55,
    title: "Teething begins",
    body: "Gums may be sore, swollen and tender for days before the first tooth actually breaks through. Extra dribbling, chewing on everything and disturbed sleep are common.",
    whatToDo:
      "Wipe your baby's gums with a clean, damp cloth once a day, even before any tooth appears. Chilled — not frozen — clean teething rings help. A frozen ring is hard enough to bruise the gum.",
    watchFor:
      "Teething does not cause a high fever, diarrhoea or a rash. If your baby has those, it is something else and worth seeing a doctor about.",
  },
  {
    age: "~6–10 months",
    cm: 62,
    title: "First tooth",
    body: "Usually one of the two lower front teeth. Some babies get their first at four months and some at twelve — both are normal.",
    whatToDo:
      "Start brushing the day the first tooth appears, twice a day, with a soft baby brush and a smear of fluoride toothpaste the size of a grain of rice.",
    watchFor:
      "A bottle of milk or juice in the cot at night pools sugar around the new front teeth for hours. This is the single most common cause of decay in very young children.",
  },
  {
    age: "By age 1",
    cm: 75,
    title: "First dental visit",
    body: "An infant oral examination by the first birthday, or within six months of the first tooth — whichever comes first.",
    whatToDo:
      "Book a first visit even though nothing is wrong. It is short, gentle, usually done with your baby on your lap, and it sets the pattern that the dentist is somewhere you go routinely rather than somewhere you go when something hurts.",
    watchFor:
      "White or brown lines along the gum edge of the upper front teeth are early decay, not staining. They are easy to miss and much easier to treat early.",
  },
  {
    age: "Age 2–3",
    cm: 92,
    title: "All twenty baby teeth in",
    body: "The full set of 20 baby teeth is usually through by around age three, finishing with the back molars.",
    whatToDo:
      "Move to a pea-sized amount of fluoride toothpaste. Brush your child's teeth for them — a three-year-old does not have the hand control to do it properly, however keen they are. Let them have a go first, then you finish.",
    watchFor:
      "Encourage spitting rather than rinsing after brushing. Rinsing washes away the fluoride that has just been applied.",
  },
  {
    age: "Around age 6",
    cm: 115,
    title: "Sealants and the first adult molars",
    body: "The first permanent molars arrive right at the back, behind the last baby teeth — without any baby tooth falling out first. Many parents never notice they have come through.",
    whatToDo:
      "Ask about fissure sealants for these teeth. The biting surface has deep grooves narrower than a toothbrush bristle, and sealing them is quick, painless and needs no drilling.",
    watchFor:
      "Because no tooth falls out first, these are often mistaken for baby teeth and treated as expendable. They are adult teeth and are meant to last a lifetime.",
  },
  {
    age: "Around age 7",
    cm: 125,
    title: "Orthodontic assessment",
    body: "A good age for an early look at how the jaws are growing and how the bite is meeting — not to fit braces, but to spot anything worth guiding while the jaw is still developing.",
    whatToDo:
      "Have the assessment even if the teeth look straight. Some of the most useful orthodontic work is done early and invisibly, by guiding growth rather than moving teeth.",
    watchFor:
      "Crowding, a crossbite, or a thumb-sucking habit that is still going strong. All three are much simpler to address now than at fourteen.",
  },
  {
    age: "Age 9–12",
    cm: 148,
    title: "Losing baby teeth steadily",
    body: "The back baby teeth are replaced through this stretch. The mouth can look uneven and gappy for a couple of years — usually nothing is wrong.",
    whatToDo:
      "Keep six-monthly check-ups going. This is the age when brushing quietly slips, because children take it over themselves and nobody is checking.",
    watchFor:
      "If a baby tooth is lost early — knocked out or extracted — the teeth either side can drift into the gap and block the adult tooth underneath. A space maintainer holds the room until it comes through.",
  },
  {
    age: "Early teens",
    cm: 165,
    title: "Braces or aligners, if needed",
    body: "Most orthodontic treatment starts once the majority of adult teeth are in.",
    whatToDo:
      "Discuss braces versus clear aligners honestly with your teenager in the room. Aligners only work if they are actually worn for the required hours a day, and that is their decision to keep, not yours.",
    watchFor:
      "Cleaning around fixed braces is genuinely harder and decay around the brackets is common. This is worth more attention than the straightening itself.",
  },
  {
    age: "Mid-to-late teens",
    cm: 172,
    title: "Wisdom-tooth assessment",
    body: "A check on whether wisdom teeth are forming, where they are pointing, and whether there is room for them.",
    whatToDo:
      "Have them assessed before they cause trouble. Knowing early whether there is space changes whether anything needs doing at all.",
    watchFor:
      "Not every wisdom tooth needs removing. Many sit perfectly well and are best left alone — assessment is about knowing which.",
  },
  {
    age: "Age 18",
    cm: 178,
    title: "Into adult care",
    body: "At eighteen, patients move on to an adult dental practice.",
    whatToDo:
      "Ask for a summary of your child's dental history to pass on. Eighteen years of records — what was treated, what was watched, how they cope with treatment — is worth handing over rather than starting again.",
    watchFor:
      "This is the point where a lot of young adults stop going to a dentist at all. Booking the first adult appointment before they leave makes it far more likely they keep going.",
  },
];
