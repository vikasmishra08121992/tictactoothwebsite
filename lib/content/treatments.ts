import { cleanContent } from "@/lib/content/clean";
/**
 * Treatment groups, in the order they appear on the page.
 *
 * The client reviewed a flat list of twenty and said it was too many to take
 * in, and that several treatments actually offered were missing. Both are
 * true. Grouping is the answer to the first: nothing was removed, because the
 * client did not say which to remove and deleting a service they provide
 * would be worse than a long page. "Advanced dental treatments" is the
 * client's own heading and its contents are the client's own list.
 */
export const TREATMENT_GROUPS = [
  "Check-ups & prevention",
  "Fillings & crowns",
  "Advanced dental treatments",
  "Straightening & jaw growth",
  "Emergencies, extractions & surgery",
  "Comfort & special care",
] as const;

export type TreatmentGroup = (typeof TREATMENT_GROUPS)[number];

export type Treatment = {
  slug: string;
  name: string;
  group: TreatmentGroup;
  shortDescription: string;
  /** Shown with a Teens tag, folded in from the old standalone Teens page. */
  teenRelevant?: boolean;
  ageNote: string;
  whatHappens: string[];
  whatChildFeels: string;
  parentFaq: { q: string; a: string }[];
  kidExplainer: string;
};

const RAW_TREATMENTS: Treatment[]  = [
  {
    slug: "cavity-fillings",
    group: "Fillings & crowns",
    name: "Cavity fillings",
    shortDescription:
      "Removing decay and rebuilding the tooth with a tooth-coloured filling material.",
    ageNote: "Any age, once a cavity is found, usually from around age 3 onward.",
    whatHappens: [
      "We show your child the mirror and the 'sleepy juice' (local anaesthetic gel) before anything else happens.",
      "The tooth is gently numbed, your child may feel a small pinch, then nothing at that spot.",
      "Decay is cleaned out with a slow, low-vibration handpiece, narrated the whole time.",
      "The tooth is rebuilt in tooth-coloured material and checked against the bite.",
    ],
    whatChildFeels:
      "A cold-water rinse, some vibration and pressure, and, after the numbing takes hold, no sharp sensation. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "How long does a filling take?",
        a: "[PLACEHOLDER: typical chair time, e.g. 20–30 minutes per tooth]",
      },
      {
        q: "Will the numbness wear off safely?",
        a: "Yes, we talk you through aftercare so your child doesn't bite their lip or cheek while it's numb. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "We'll clean out the sleepy spot on your tooth and fill it back in with a strong, tooth-coloured filling, like patching a tiny pothole so your tooth is smooth and strong again.",
  },
  {
    slug: "braces-clear-aligners",
    group: "Straightening & jaw growth",
    teenRelevant: true,
    name: "Braces & clear aligners",
    shortDescription:
      "Straightening teeth and correcting bite over time, for children and teens.",
    ageNote:
      "Early/interceptive orthodontics can start around age 7; full braces or aligners are typically fitted once most adult teeth are in, from the early teens.",
    whatHappens: [
      "An assessment, records (photos, scans or moulds), and a plan reviewed with you and your child.",
      "Fitting of fixed braces or handover of the first set of clear aligners, with full instructions.",
      "Scheduled check-ins to adjust braces, or to issue the next set of aligners.",
      "A retention plan once treatment is complete, to hold the new position.",
    ],
    whatChildFeels:
      "Some pressure or soreness for a few days after fitting or each adjustment, settling with normal eating. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "Braces or clear aligners, which is right for my child?",
        a: "It depends on the bite, the child's age, and how consistently aligners can be worn. We'll recommend an option at the assessment, not before. [CLINICAL REVIEW REQUIRED]",
      },
      {
        q: "How long does treatment usually take?",
        a: "[PLACEHOLDER: typical treatment length range]",
      },
      {
        q: "What does it cost?",
        a: "Cost depends on the treatment plan agreed at the assessment. We give you a written figure before anything starts. [PLACEHOLDER: whether any indicative range should be quoted here.]",
      },
    ],
    kidExplainer:
      "Braces and aligners gently guide your teeth into their best positions over time, a bit like a gentle nudge every few weeks, not a big push all at once.",
  },
  {
    slug: "dental-trauma",
    group: "Emergencies, extractions & surgery",
    name: "Dental trauma / knocked-out tooth",
    shortDescription:
      "Emergency care for a chipped, loosened, or knocked-out tooth.",
    ageNote: "Any age, most common in active children and teens aged 7–14.",
    whatHappens: [
      "Call us immediately, see Dental Emergency for what to do in the first 30 minutes.",
      "We assess the tooth, the socket, and check for any other injury.",
      "Depending on the tooth (baby or adult) and the injury, we may reposition, splint, or advise monitoring.",
      "A follow-up plan is set, since trauma outcomes are often assessed over weeks, not just on the day.",
    ],
    whatChildFeels:
      "This is a frightening moment for any child, our first job is comfort and calm, then treatment. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "My child's adult tooth was knocked out, what do I do right now?",
        a: "Go to Dental Emergency now for the first-30-minutes sequence, then call us on your way in.",
      },
      {
        q: "Will a knocked-out baby tooth be put back in?",
        a: "Usually not. Re-implanting a baby tooth can risk the adult tooth developing underneath. We'll examine and advise. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "If a tooth gets hurt or comes out, that's scary, but it's fixable. We'll take great care of you and explain everything before we do it.",
  },
  {
    slug: "infant-oral-exam",
    group: "Check-ups & prevention",
    name: "Infant oral exam (by age one)",
    shortDescription: "A first check-up as soon as the first tooth appears, and by the first birthday.",
    ageNote: "From first tooth eruption, and by age one at the latest.",
    whatHappens: ["A gentle knee-to-knee exam.", "Guidance on brushing, feeding, and teething for you."],
    whatChildFeels: "Brief and gentle, most infants tolerate it well held in a parent's lap. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "Why so early?", a: "Early exams catch feeding-related decay risks and start good habits from day one. [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "We just take a quick look and count your teeth, like a tiny checkup!",
  },
  {
    slug: "fluoride",
    group: "Check-ups & prevention",
    name: "Fluoride treatment",
    shortDescription: "A protective fluoride varnish applied to strengthen enamel.",
    ageNote: "From the first tooth onward, at routine check-ups.",
    whatHappens: ["A flavoured varnish is painted onto the teeth and sets in seconds."],
    whatChildFeels: "No discomfort, just a taste and a quick paint-on step. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "Is fluoride safe for young children?", a: "[PLACEHOLDER: dosage/safety guidance] [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "We paint a special shiny coat onto your teeth to help them stay strong.",
  },
  {
    slug: "sealants",
    group: "Check-ups & prevention",
    name: "Sealants",
    shortDescription: "A thin protective coating on the chewing surfaces of back teeth, to block decay.",
    ageNote: "Typically applied around age six, as first adult molars come in.",
    whatHappens: ["Teeth are cleaned and dried.", "A liquid sealant is flowed into the grooves and set with a light."],
    whatChildFeels: "No numbing needed, a dry mouth for a few minutes is the only sensation. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "How long do sealants last?", a: "[PLACEHOLDER: typical lifespan, monitored at check-ups]" }],
    kidExplainer: "It's like a raincoat for the little grooves in your back teeth, so food and germs can't hide there.",
  },
  {
    slug: "pulpectomy",
    group: "Advanced dental treatments",
    name: "Pulpectomy",
    shortDescription: "Treatment for a baby tooth whose nerve has been affected by deep decay or injury.",
    ageNote: "Baby teeth, when decay or injury has reached the nerve.",
    whatHappens: ["The affected nerve tissue is removed under local anaesthetic.", "The tooth is disinfected, filled, and usually capped with a crown."],
    whatChildFeels: "Numbing is used throughout; most children describe pressure rather than pain. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "Why save a baby tooth at all?", a: "Baby teeth hold space for adult teeth and support speech and chewing until they fall out naturally. [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "We help the sleepy part deep inside your tooth feel better, then protect it with a strong cap.",
  },
  {
    slug: "crowns",
    group: "Fillings & crowns",
    name: "Zirconia & steel crowns",
    shortDescription: "Full-coverage caps that protect a heavily treated or weakened tooth.",
    ageNote: "Baby or young permanent teeth needing more support than a filling alone.",
    whatHappens: ["The tooth is shaped.", "A pre-formed zirconia (tooth-coloured) or steel crown is fitted and cemented."],
    whatChildFeels: "Similar sensation to a filling appointment, done under local anaesthetic. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "Zirconia or steel, what's the difference?", a: "Zirconia is tooth-coloured and used mostly on front teeth; steel is very durable and common on back teeth. [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "Your tooth gets a strong little helmet to keep it safe while it does its job.",
  },
  {
    slug: "space-maintainers",
    group: "Straightening & jaw growth",
    name: "Space maintainers",
    shortDescription: "A small appliance that holds space open after a baby tooth is lost early.",
    ageNote: "Whenever a baby tooth is lost well before its natural time.",
    whatHappens: ["A custom-fitted appliance is cemented or fitted to hold the gap.", "Checked periodically until the adult tooth is ready to come through."],
    whatChildFeels: "A little strange for the first day or two, then unnoticeable. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "Why does the gap need holding open?", a: "Without it, neighbouring teeth can drift into the space and crowd the adult tooth trying to come through. [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "It's a little placeholder that keeps your grown-up tooth's parking spot free until it's ready to arrive.",
  },
  {
    slug: "extractions",
    group: "Emergencies, extractions & surgery",
    name: "Extractions",
    shortDescription: "Removing a tooth that cannot be saved, or is causing crowding.",
    ageNote: "Any age, when clinically necessary.",
    whatHappens: ["Local anaesthetic is used to numb the area fully.", "The tooth is gently loosened and removed.", "Aftercare instructions are given."],
    whatChildFeels: "Pressure during the procedure, with numbness preventing sharp pain; mild soreness afterward is normal. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "What can my child eat afterward?", a: "[PLACEHOLDER: aftercare diet guidance] [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "Sometimes a wiggly or troublesome tooth needs to come out so your smile can stay healthy, we'll make sure you're comfortable the whole time.",
  },
  {
    slug: "habit-breaking-appliances",
    group: "Straightening & jaw growth",
    name: "Habit-breaking appliances",
    shortDescription: "Gentle appliances to help end thumb-sucking or tongue-thrust habits affecting the bite.",
    ageNote: "Usually considered from age 4–5 if a habit persists and affects tooth position.",
    whatHappens: ["A custom appliance is fitted.", "Reviewed periodically alongside encouragement strategies at home."],
    whatChildFeels: "Mild adjustment period getting used to the appliance; not painful. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "Is this only for thumb-sucking?", a: "It also helps with prolonged pacifier use and tongue-thrust patterns that shift teeth. [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "This little helper gently reminds your mouth to build new habits instead of old ones.",
  },
  {
    slug: "early-orthodontics",
    group: "Straightening & jaw growth",
    name: "Early / interceptive orthodontics",
    shortDescription: "Guiding jaw growth and tooth position early, before full braces are needed.",
    ageNote: "Typically assessed around age 7.",
    whatHappens: ["An assessment of jaw growth and bite.", "If needed, a removable or fixed appliance guides growth over a set period."],
    whatChildFeels: "Mild pressure when appliances are adjusted, similar to braces. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "Why assess this early, if braces come later?", a: "Some bite and jaw issues are far easier to guide while your child is still growing. [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "This helps your jaw grow in just the right way while you're still growing, like guide rails.",
  },
  {
    slug: "wisdom-tooth-assessment",
    group: "Check-ups & prevention",
    teenRelevant: true,
    name: "Wisdom-tooth assessment",
    shortDescription: "Checking how wisdom teeth are developing and whether they'll need attention.",
    ageNote: "From the mid-to-late teens onward.",
    whatHappens: ["A clinical exam and imaging as needed.", "A plan, monitor, or refer for removal if indicated."],
    whatChildFeels: "The assessment itself is non-invasive. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "Do all teens need their wisdom teeth removed?", a: "No, many wisdom teeth come in without issue. We assess before recommending anything. [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "",
  },
  {
    slug: "sports-mouthguards",
    group: "Check-ups & prevention",
    teenRelevant: true,
    name: "Sports mouthguards",
    shortDescription: "Custom-fitted mouthguards to protect teeth during sport.",
    ageNote: "Any age playing contact or high-impact sport.",
    whatHappens: ["An impression or scan of the teeth is taken.", "A custom mouthguard is fabricated and fitted."],
    whatChildFeels: "The fitting is quick and comfortable. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [{ q: "Why custom over an off-the-shelf mouthguard?", a: "A custom fit protects better and is far more likely to actually be worn. [CLINICAL REVIEW REQUIRED]" }],
    kidExplainer: "",
  },
  {
    slug: "special-needs-dentistry",
    group: "Comfort & special care",
    name: "Special-needs dentistry",
    shortDescription: "Sensory-friendly, longer, adapted appointments, see Special Needs & Inclusive Care.",
    ageNote: "Any age.",
    whatHappens: ["See our full Special Needs & Inclusive Care page for how appointments are adapted."],
    whatChildFeels: "Varies by child, our approach is built around each child's needs. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [],
    kidExplainer: "",
  },
  {
    slug: "general-anaesthesia",
    group: "Comfort & special care",
    name: "Treatment under general anaesthesia",
    shortDescription:
      "Completing all necessary treatment in one session, asleep, for children who cannot manage it awake.",
    ageNote:
      "Considered when treatment need is extensive, or when a child cannot tolerate care awake even with support.",
    whatHappens: [
      "A full assessment and a written treatment plan, agreed with you before anything is scheduled.",
      "Pre-operative checks and fasting instructions, explained in advance.",
      "All planned treatment is completed in one session while your child is asleep, with an anaesthetist present throughout.",
      "Recovery is monitored before you go home, with written aftercare and a follow-up appointment.",
    ],
    whatChildFeels:
      "Your child is asleep for the procedure and feels nothing during it. Grogginess, a sore mouth and tiredness afterwards are normal. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "Is general anaesthesia done here or elsewhere?",
        a: "[CONFIRM: whether GA is delivered on site or by referral, and to which facility.]",
      },
      {
        q: "Why would this be recommended over several ordinary visits?",
        a: "Usually when the treatment needed would take more appointments than a child can cope with, or when the alternative is repeated distressing visits. It is always discussed with you first, never presented as the only option without explanation. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "You have a special sleep so we can finish everything at once. You will not feel it, and a grown-up is right there when you wake up.",
  },
  {
    slug: "jaw-and-tmj",
    group: "Straightening & jaw growth",
    name: "Jaw & TMJ concerns",
    teenRelevant: true,
    shortDescription:
      "Assessment of clicking, discomfort or pain when chewing or opening wide.",
    ageNote: "Any age, but most often raised by teenagers.",
    whatHappens: [
      "A history, when it happens, what makes it worse, and whether there is grinding or clenching.",
      "An examination of the joint, the bite and the surrounding muscles.",
      "A plan: self-management advice, a night guard, or referral. [CLINICAL REVIEW REQUIRED]",
    ],
    whatChildFeels: "The assessment itself is non-invasive. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "My teenager's jaw clicks. Is that a problem?",
        a: "Clicking on its own is common and often needs nothing done. It is worth assessing if it comes with pain, locking, or difficulty opening. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer: "",
  },
  {
    slug: "teeth-whitening",
    group: "Fillings & crowns",
    name: "Teeth whitening",
    teenRelevant: true,
    shortDescription:
      "[CONFIRM: whether whitening is offered, from what age, and by which method.]",
    ageNote: "[CONFIRM: minimum age policy for whitening.]",
    whatHappens: [
      "[CONFIRM: the whitening method and process offered, if any.] [CLINICAL REVIEW REQUIRED]",
    ],
    whatChildFeels:
      "Some temporary sensitivity is common with whitening. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "Is whitening suitable for teenagers?",
        a: "[CONFIRM: the clinic's position, including any age limit and whether it is offered at all.]",
      },
    ],
    kidExplainer: "",
  },
  // ---- Added after client review: treatments offered but missing from the list ----
  {
    slug: "root-canal-treatment",
    name: "Root canal treatment",
    group: "Advanced dental treatments",
    shortDescription:
      "Saving a permanent tooth whose nerve has been damaged by deep decay or injury, instead of removing it.",
    ageNote:
      "Permanent (adult) teeth, usually in older children and teenagers. Baby teeth are treated with a pulpectomy instead.",
    whatHappens: [
      "The tooth is numbed fully and isolated with a small rubber sheet so it stays dry and your child cannot taste anything.",
      "The damaged nerve tissue is removed from the root canals, which are then cleaned, shaped and disinfected.",
      "The canals are sealed, and the tooth is rebuilt, usually with a crown, because a root-treated tooth is more brittle than a healthy one.",
      "It may take more than one visit, depending on the tooth and how much infection there was.",
    ],
    whatChildFeels:
      "Numb throughout. The rubber sheet feels odd for the first minute and is then forgotten. Some tenderness on biting for a few days afterwards is normal. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "Why not just take the tooth out?",
        a: "An adult tooth is meant to last a lifetime, and removing one in a child leaves a gap that shifts neighbouring teeth and complicates orthodontics later. Root canal treatment keeps the tooth. [CLINICAL REVIEW REQUIRED]",
      },
      {
        q: "How is this different from a pulpectomy?",
        a: "The principle is the same, clean out the damaged nerve and seal the tooth, but a pulpectomy is done on a baby tooth that will eventually fall out, so different materials are used. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "Deep inside your tooth there is a tiny room that got poorly. We clean the room out, tidy it up and close the door, so the tooth can stay and keep working.",
  },
  {
    slug: "pulpotomy",
    name: "Pulpotomy",
    group: "Advanced dental treatments",
    shortDescription:
      "Removing only the top, damaged part of a baby tooth's nerve, leaving the healthy root portion in place.",
    ageNote: "Baby teeth where decay has reached the nerve but the roots are still healthy.",
    whatHappens: [
      "The tooth is numbed and the decay removed.",
      "The inflamed part of the nerve in the crown of the tooth is taken away; the healthy nerve in the roots is left and treated with a medicated dressing.",
      "The tooth is sealed and usually protected with a crown.",
    ],
    whatChildFeels:
      "Numb throughout, most children describe pressure and a strange taste from the dressing rather than pain. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "Pulpotomy or pulpectomy, which does my child need?",
        a: "A pulpotomy is the smaller procedure, used when only the top of the nerve is affected. If the infection has reached the roots, a pulpectomy is needed instead. The dentist decides on the day from what is found inside the tooth. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "Just the top bit of the sleepy part inside your tooth is poorly, so we take that bit away, put some special medicine in, and give the tooth a helmet.",
  },
  {
    slug: "pulp-capping",
    name: "Pulp capping",
    group: "Advanced dental treatments",
    shortDescription:
      "Protecting a nerve that is very close to, or just touching, a deep cavity, so a root treatment may not be needed at all.",
    ageNote: "Any tooth where a deep cavity has come close to the nerve but the nerve is still healthy.",
    whatHappens: [
      "Decay is removed carefully, stopping just short of the nerve.",
      "A protective, healing material is placed over the exposed or nearly exposed nerve.",
      "The tooth is sealed with a filling on top, and monitored at later check-ups to confirm the nerve has stayed healthy.",
    ],
    whatChildFeels:
      "The same as a filling, numb throughout, some vibration and pressure. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "Does this always work?",
        a: "Not always. It gives the nerve the best chance of recovering, and it is monitored. If the nerve does not settle, a pulpotomy or root treatment is the next step, nothing is lost by trying the smaller procedure first. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "The hole in your tooth got very close to the sleepy part inside, so we put a little cushion over it to keep it safe, then fill the hole.",
  },
  {
    slug: "regenerative-endodontics",
    name: "Regenerative endodontics",
    group: "Advanced dental treatments",
    shortDescription:
      "A treatment for a young adult tooth whose nerve has died before the root finished growing, encouraging the root to keep developing.",
    ageNote: "Permanent teeth in children and young teenagers, where the root is not yet fully formed.",
    whatHappens: [
      "The tooth is numbed, isolated and the canal thoroughly disinfected over one or more visits.",
      "Rather than filling the canal, the tooth is encouraged to bring new tissue and blood supply into the root.",
      "The tooth is sealed and then followed up over months with X-rays to check the root is continuing to develop.",
    ],
    whatChildFeels:
      "Numb throughout. Follow-up visits are short and involve only an X-ray and a look. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "Why not a normal root canal?",
        a: "A root that has not finished growing has thin walls and an open end. A conventional root filling leaves it thin and fragile for life. Regenerative treatment aims to let the root thicken and lengthen as it would have naturally. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "Your grown-up tooth's root did not finish growing, so we clean it out and help it carry on growing strong by itself.",
  },
  {
    slug: "frenectomy",
    name: "Frenectomy / tongue-tie correction",
    group: "Advanced dental treatments",
    shortDescription:
      "Releasing a tight band of tissue under the tongue or upper lip that restricts movement, feeding or speech.",
    ageNote:
      "From infancy, when a tongue-tie is affecting feeding, through to older children where it affects speech, cleaning or tooth position.",
    whatHappens: [
      "The tight band, the frenulum, is assessed for how much it actually restricts movement, because not every visible tie needs treating.",
      "If it does, the area is numbed and the band is released in a short procedure.",
      "For babies, this is often over in moments. Older children are given simple stretches to do afterwards so it heals without re-tightening.",
    ],
    whatChildFeels:
      "Brief, numbed for older children, and typically very quick for infants. Some soreness for a day or two afterwards. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "How do I know if my child has a tongue-tie?",
        a: "Difficulty breastfeeding in a baby, or in an older child an inability to lift the tongue tip to the roof of the mouth, difficulty with certain sounds, or a gap between the front teeth held open by a tight lip tie. An assessment tells you whether it is actually restricting anything. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "There is a little string under your tongue that is holding it too tight. We let it go so your tongue can move freely.",
  },
  {
    slug: "jaw-expansion",
    name: "Jaw expansion",
    group: "Advanced dental treatments",
    shortDescription:
      "Gently widening a narrow upper jaw while a child is still growing, to make room for the adult teeth and correct a crossbite.",
    ageNote: "Usually between about 7 and 12, while the upper jaw is still in two halves that can be guided apart.",
    whatHappens: [
      "Impressions or a scan are taken and a custom expander is made to fit the upper teeth.",
      "The expander is fitted, and a parent turns a small key in it at home on a schedule, widening it by a fraction of a millimetre at a time.",
      "Once the right width is reached, the expander stays in place for some months while the new bone settles.",
    ],
    whatChildFeels:
      "Pressure across the roof of the mouth for a few minutes after each turn, and a lisp for the first few days. A gap opening between the front teeth is normal and closes on its own. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "Why do this now rather than with braces later?",
        a: "The upper jaw fuses into one piece in the teens. Before then it can be widened; after, the same correction needs surgery. This is the clearest example of why an orthodontic assessment at seven matters. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "Your top jaw needs a bit more room for all your grown-up teeth. This gently makes it a tiny bit wider every day, you will not feel it growing.",
  },
  {
    slug: "surgical-extraction",
    name: "Surgical extraction",
    group: "Emergencies, extractions & surgery",
    shortDescription:
      "Removing a tooth that cannot come out simply, one that is broken at the gum, impacted, or has not come through.",
    ageNote: "Any age, when a simple extraction is not possible.",
    whatHappens: [
      "The area is numbed fully; sedation options are discussed beforehand where a child needs them.",
      "A small opening is made in the gum, and if needed the tooth is divided to remove it in pieces rather than forcing it out whole.",
      "The area is cleaned and closed with a few dissolving stitches. Aftercare is explained before you leave.",
    ],
    whatChildFeels:
      "Pressure and pushing during the procedure, but no sharp pain. Swelling and soreness for a few days afterwards, managed with the aftercare given. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "Will my child need to be asleep for this?",
        a: "Not necessarily. Many surgical extractions are done with local anaesthetic alone or with laughing gas. For a very anxious child, or a difficult tooth, general anaesthesia is an option and is discussed with you first. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "This tooth is stuck and needs a bit more help to come out. You will be numb the whole time, and you will feel pushing but nothing sharp.",
  },
  {
    slug: "minor-surgical-procedures",
    name: "Minor surgical procedures",
    group: "Emergencies, extractions & surgery",
    shortDescription:
      "Small procedures on the gums and mouth, uncovering a tooth that is stuck, removing an extra tooth, or treating a cyst or growth.",
    ageNote: "Any age, as needed.",
    whatHappens: [
      "The specific procedure is explained to you in the consultation room first, with what it involves and why.",
      "The area is numbed and the procedure carried out, usually in a single short visit.",
      "Stitches, if used, are dissolving. A review visit checks healing.",
    ],
    whatChildFeels:
      "Numb throughout, with some soreness for a few days afterwards. [CLINICAL REVIEW REQUIRED]",
    parentFaq: [
      {
        q: "What counts as a minor procedure?",
        a: "Common examples are exposing an adult tooth that is stuck under the gum so it can be guided into place, removing an extra (supernumerary) tooth that is blocking others, and dealing with small cysts or lumps in the mouth. [CLINICAL REVIEW REQUIRED]",
      },
    ],
    kidExplainer:
      "A small job on your gums to help a tooth or fix a little bump. We will tell you exactly what we are doing, and you will be numb.",
  },
];




/** Review markers stripped, see lib/content/clean.ts. */
export const treatments = cleanContent(RAW_TREATMENTS);
export function getTreatment(slug: string) {
  return treatments.find((t) => t.slug === slug);
}
