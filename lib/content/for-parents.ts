/**
 * The everyday questions parents ask.
 *
 * This started as five one-paragraph answers. It is the page a parent reaches
 * for at eleven at night after noticing something at bedtime, so brevity was
 * the wrong optimisation: each topic now gives a one-line answer for someone
 * scanning, and the detail underneath for someone who has stopped to read.
 *
 * [CLINICAL REVIEW REQUIRED] on every entry marked `clinical`. These are
 * general guidance written to be reviewed, not diagnosis, and the treating
 * dentist must sign them off before the page goes live. Nothing here invents a
 * statistic, a study or a claim about outcomes.
 */

export type ParentTopic = {
  id: string;
  q: string;
  /** The answer in one sentence, for a parent who is scanning. */
  short: string;
  /** The fuller answer, one paragraph per element. */
  detail: string[];
  clinical?: boolean;
};

export const parentTopics: ParentTopic[] = [
  {
    id: "first-visit",
    q: "What actually happens at a first visit?",
    short:
      "A look, a count, a clean if needed, and a conversation — usually no treatment at all.",
    detail: [
      "Your child chooses which of the two rooms they sit in before anything else happens. For a very young child, the whole appointment can happen sitting on your lap.",
      "The dentist counts the teeth out loud, checks the gums and bite, and looks for early signs of decay. Every instrument is shown and named first — often demonstrated on a finger or a glove — so nothing arrives in the mouth unannounced.",
      "You will be asked about feeding, bottles, dummies, brushing and any family history of dental problems. These sound like small talk and are not: they are the strongest predictors of how a child's teeth will fare.",
      "You then get a plan in plain language — what is fine, what is being watched, and what if anything needs doing. Nothing is booked in the same appointment unless you want it to be.",
    ],
  },
  {
    id: "baby-teeth",
    q: "Do baby teeth really matter if they fall out anyway?",
    short:
      "Yes — they hold the space for the adult teeth and they can hurt just as much.",
    detail: [
      "A baby tooth lost too early lets the teeth on either side drift into the gap, so the adult tooth underneath comes through crooked or gets blocked entirely. Fixing that later is orthodontics; preventing it now is often a small space maintainer.",
      "Decay in a baby tooth causes real pain, disturbed sleep, missed school and infection, and the nerve sits closer to the surface than in an adult tooth, so it reaches that stage faster.",
      "The last baby teeth are not lost until around age twelve. A tooth that has to last another eight years is worth treating properly.",
    ],
    clinical: true,
  },
  {
    id: "brushing",
    q: "Brushing by age — what is normal at each stage?",
    short:
      "Twice a day from the first tooth, with fluoride toothpaste, done by a parent until about age seven.",
    detail: [
      "First tooth to age 3: a smear of fluoride toothpaste roughly the size of a grain of rice, brushed by a parent, morning and last thing at night.",
      "Age 3 to 6: a pea-sized amount, still parent-supervised. Let your child start and then finish the job yourself — the back teeth and the gum line are where a young child always misses.",
      "From about age 7, most children have the hand control to brush properly on their own, but keep checking. This is the age at which brushing quietly deteriorates because nobody is watching any more.",
      "Encourage spitting rather than rinsing afterwards. Rinsing with water washes away the fluoride that has just been applied, which is most of the point of the toothpaste.",
      "The last thing that touches the teeth before bed should be the toothbrush. Saliva flow drops overnight, so anything eaten after brushing sits on the teeth for hours.",
    ],
    clinical: true,
  },
  {
    id: "sugar",
    q: "Sugar and diet — what actually matters?",
    short: "How often, far more than how much.",
    detail: [
      "Every time sugar reaches the teeth, the mouth turns acidic for a period afterwards, and it is that acid rather than the sugar itself that dissolves enamel. Ten sweets eaten in one sitting cause one acid attack; the same ten spread across a day cause ten.",
      "Sipping juice, squash or sweetened milk from a bottle or beaker across an afternoon is the most damaging pattern there is, because the mouth never gets back to neutral.",
      "Water and plain milk between meals. Keep anything sweet to mealtimes, when there is more saliva to neutralise the acid.",
      "Watch the things that are not obviously sweet — dried fruit, fruit juice, biscuits, flavoured yoghurts and many breakfast cereals all behave like sugar on teeth, and dried fruit sticks in the grooves.",
      "Do not brush straight after anything acidic such as fruit juice or a fizzy drink. The enamel is softened for a while and brushing scrubs it away; wait about an hour, or rinse with water and brush later.",
    ],
    clinical: true,
  },
  {
    id: "teething",
    q: "Teething — what to expect, and what is not teething",
    short:
      "Sore gums, dribbling and broken sleep are normal from around six months; a fever is not.",
    detail: [
      "Symptoms usually start a few days before a tooth actually appears and settle once it is through. Extra dribbling, chewing on everything and being generally miserable are all typical.",
      "Chilled — not frozen — clean teething rings help. A ring straight from the freezer is hard enough to bruise the gum.",
      "A clean finger or damp cloth rubbed firmly along the gum often helps more than anything you can buy.",
      "Teething does not cause a high fever, diarrhoea, vomiting or a rash. Those are a separate illness that happens to have coincided, and are worth seeing a doctor about rather than attributing to teeth.",
      "Only use teething gels on advice — some are not suitable for babies, and the ones that are should be used sparingly.",
    ],
    clinical: true,
  },
  {
    id: "injury",
    q: "My child has knocked out or broken a tooth — what do I do right now?",
    short:
      "Call us immediately. For a knocked-out adult tooth, the first thirty minutes matter enormously.",
    detail: [
      "Pick the tooth up by the crown — the white part you normally see — and never by the root.",
      "If it is dirty, rinse it briefly in milk or the child's own saliva. Do not scrub it, do not use soap, and do not let it dry out.",
      "If you can, push an adult tooth gently back into the socket the right way round and have your child bite softly on a clean cloth to hold it. If you cannot, keep it in a cup of milk — not water — and bring it with you.",
      "Do not try to reimplant a baby tooth. Putting it back can damage the adult tooth developing above it. Bring it with you anyway so we can check it is complete.",
      "Then call us straight away. A knocked-out adult tooth has the best chance of surviving if it is back in place quickly, so this is one of the few genuine dental emergencies where minutes count.",
    ],
    clinical: true,
  },
  {
    id: "anxious",
    q: "My child is terrified of the dentist. What should I do?",
    short:
      "Tell us before you come, and let us do the explaining — including about pain.",
    detail: [
      "Say so when you book. We can put aside a longer, unhurried slot, or arrange a visit with no treatment at all, just to meet the team and sit in the chair.",
      "Avoid promising it will not hurt. If it then does, even slightly, your child learns that adults are not straight with them in this room, and that is much harder to undo than the fear itself.",
      "Try to avoid words like needle, drill, injection and pain in the run-up, even in reassurance — \"it won't hurt\" plants the idea of hurting. We use our own vocabulary with children and it works better if it is the first one they hear.",
      "Do not pass on your own bad experiences at the dentist, however sympathetically. Children take fear from their parents faster than from anything that happens in the chair.",
      "Books, a social story, or watching a sibling have a check-up first all help. Our Special Needs page has a downloadable social story that works well for any anxious child, not only children with additional needs.",
    ],
  },
  {
    id: "thumb",
    q: "Thumb-sucking and dummies — when do they become a problem?",
    short:
      "Usually not before age three or four. It matters once adult front teeth are on their way.",
    detail: [
      "Most children give up on their own between three and four, and no intervention is needed.",
      "If the habit is still strong once the adult front teeth are coming through, sustained pressure can push the front teeth forward and change how the bite meets. That is the point at which it is worth acting.",
      "Nagging and shaming reliably fail, and they tend to increase the behaviour because it is a self-soothing habit. Gentle reminders, rewards for the times they manage without, and identifying when the habit happens — usually tiredness or boredom — work better.",
      "Where a habit really will not shift, a habit-breaking appliance can be fitted. It is not a punishment; it simply makes the sucking unsatisfying so the habit fades.",
    ],
    clinical: true,
  },
  {
    id: "orthodontics",
    q: "When should we get an orthodontic assessment?",
    short: "Around age seven — well before anyone is thinking about braces.",
    detail: [
      "Age seven is useful because the first adult molars and front teeth are usually in by then, which is enough to see how the bite is developing while the jaw is still growing.",
      "The assessment is not a referral for braces. Most children need nothing at that point; the value is in spotting the minority of problems that are far easier to guide early than to correct later.",
      "Crossbites, severe crowding and a persistent thumb habit are the things most worth catching at this age.",
      "See Growing Up Smiling for how this fits into the whole timeline from birth to eighteen.",
    ],
    clinical: true,
  },
  {
    id: "frequency",
    q: "How often should my child actually come?",
    short:
      "Usually every six months, but the right interval depends on your child.",
    detail: [
      "Six months is the common default, and it exists because most childhood decay is small, painless and cheap to treat if it is found within that window.",
      "A child at higher risk — previous decay, orthodontic appliances, certain medications, or a diet or medical condition that affects saliva — may be asked to come more often. A child with consistently healthy teeth may safely be seen less often.",
      "We will tell you what interval we recommend for your child and why, rather than applying the same rule to everyone.",
    ],
    clinical: true,
  },
];
