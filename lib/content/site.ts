/**
 * The hospital's identity and the facts every page needs.
 *
 * `name` is the single source of the hospital's name. Page copy interpolates
 * it rather than typing "Tic Tac Tooth" by hand, so it can never drift into
 * "the clinic", "the practice" or a half-remembered variant on one page while
 * the rest say something else. A parent should be able to land on any page —
 * from a search result, a WhatsApp link, a friend's screenshot — and know
 * immediately whose website they are on.
 *
 * Everything factual here that has not been confirmed by the client is a
 * marked placeholder. Nothing on this site invents a number, a year, a
 * qualification or a claim.
 */
export const clinic = {
  name: "Tic Tac Tooth",
  tagline: "Kids Dental Hospital",

  /** Used where the full name reads better than the short one. */
  fullName: "Tic Tac Tooth Kids Dental Hospital",

  /** One line, for meta descriptions and the footer. */
  summary:
    "A paediatric dental hospital in Maninagar, Ahmedabad, treating children and teenagers from birth to eighteen.",

  addressLines: [
    "Trivia One, 302, Kankaria Road",
    "near Lijjat Khaman, Pushpkunj, Maninagar",
    "Ahmedabad, Gujarat 380028",
  ],
  landmark: "near Lijjat Khaman, Maninagar",
  phoneDisplay: "[PLACEHOLDER: +91 9XXXX XXXXX]",
  phoneHref: "tel:+919000000000",
  whatsappHref:
    "https://wa.me/919000000000?text=Hi%20Tic%20Tac%20Tooth%2C%20I%27d%20like%20to%20book%20an%20appointment",
  timings: "[PLACEHOLDER: Mon–Sat, 10:00 AM – 7:00 PM IST]",

  /** Who the hospital is for — the first question a new parent asks. */
  ages: "Birth to 18 years",
} as const;

/**
 * The plain-English explanation of what a paediatric dental hospital is.
 *
 * Most parents arriving here have never taken a child to a dentist before and
 * do not know that "paedodontist" is a separate qualification from "dentist".
 * Saying so plainly, once, is worth more than any amount of reassuring
 * adjectives.
 */
export const aboutTicTacTooth = {
  what: `${clinic.name} is a dental hospital that treats only children and teenagers — from a baby's first tooth to an eighteenth birthday. It is not a general dental practice that also sees children.`,

  why: "Children's teeth are not small adult teeth. Baby teeth decay faster, hold space for the adult teeth behind them, and need different materials and different timing. Just as importantly, a child who is frightened at four is often still frightened at forty — so how a visit feels matters as much as what is done.",

  howWeWork: [
    {
      title: "Your child chooses the room",
      body: `${clinic.name} has two themed treatment rooms — Smiling Adventures, the space room, and Jungle Smiles, the jungle room. Your child picks which one they sit in. It is a small choice, and it is often the first time a child has been given any control over a medical appointment.`,
    },
    {
      title: "Nothing is used before it is explained",
      body: "Every instrument is shown, named and demonstrated — usually on a finger or a glove first — before it goes anywhere near your child's mouth. They are told what they will hear and feel, in words they understand.",
    },
    {
      title: "We do not promise it will not hurt",
      body: "If something might be uncomfortable, your child is told so honestly. A child who is told \"this won't hurt\" and then feels something learns that adults in clinics lie to them. That lesson lasts decades.",
    },
    {
      title: "You stay with your child",
      body: "A parent or guardian stays in the room for the whole appointment, at every step, in every room. You are never asked to wait outside.",
    },
    {
      title: "Comfort options exist, and are explained",
      body: `Where a child needs more help than talking and time can give, ${clinic.name} has laughing gas (nitrous oxide) on site, along with local and general anaesthesia pathways. What each involves is explained fully before you decide. [CLINICAL REVIEW REQUIRED]`,
    },
    {
      title: "Disability and sensory needs are planned for, not accommodated on the day",
      body: `Sensory-friendly appointments, longer unhurried slots and no-treatment desensitisation visits are part of how ${clinic.name} works, arranged in advance rather than improvised when you arrive.`,
    },
  ],
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** One line explaining what the page is, for menus and the site index. */
  description: string;
};

/**
 * Every destination, shown in the navigation at all times — no "More"
 * dropdown. Kept short enough to fit one row on its own line beneath the
 * masthead.
 */
export const primaryNav: NavItem[] = [
  {
    label: "Our Space",
    href: "/our-space",
    description:
      "The two treatment rooms, the ceiling murals, the play gym and the consultation room.",
  },
  {
    label: "Treatments",
    href: "/treatments",
    description:
      "Every treatment offered, what happens step by step, and what your child will feel.",
  },
  {
    label: "Comfort & Sedation",
    href: "/comfort-and-sedation",
    description:
      "How anxious children are helped through treatment, from talking to laughing gas to anaesthesia.",
  },
  {
    label: "Special Needs",
    href: "/special-needs",
    description:
      "Sensory-friendly visits, desensitisation appointments and communication support.",
  },
  {
    label: "No Cavity Club",
    href: "/no-cavity-club",
    description:
      "The reward scheme for children who keep their teeth cavity-free between visits.",
  },
  {
    label: "Growing Up Smiling",
    href: "/growing-up-smiling",
    description:
      "What happens to your child's teeth at each age, from teething to wisdom teeth.",
  },
  {
    label: "For Parents",
    href: "/for-parents",
    description:
      "Practical answers on brushing, diet, thumb-sucking, injuries and preparing for a visit.",
  },
  {
    label: "The Doctor",
    href: "/meet-the-doctor",
    description: "Who will be treating your child, and their qualifications.",
  },
  {
    label: "Reviews",
    href: "/reviews",
    description: "What other parents have said.",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Address, landmark directions, phone, WhatsApp and opening hours.",
  },
];
