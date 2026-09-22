import { cleanContent } from "@/lib/content/clean";
export type SocialStoryPage = {
  sentence: string;
  imageSrc?: string;
  imageAlt: string;
};

/**
 * A printable social story: first person, present tense, one short sentence
 * and one picture per page, in the order the child will experience the visit.
 * Standard practice for preparing autistic children for an unfamiliar place,
 * and almost no dental clinic provides one.
 *
 * Self-contained on purpose, it previously derived its images from the First
 * Visit walkthrough, which the client has since removed. No mascot and no
 * exclamation marks here, per the special-needs register.
 */
const RAW_SOCIAL_STORY_PAGES: SocialStoryPage[]  = [
  {
    sentence: "I am going to Tic Tac Tooth for a dental visit.",
    imageSrc: "/images/entrance/entrance_backlit-sign-dusk.jpg",
    imageAlt:
      "The Tic Tac Tooth entrance, a backlit sign glowing warm gold beside a wood-slat door",
  },
  {
    sentence: "I walk through the door.",
    imageSrc: "/images/no-cavity-club/no-cavity-club_mascot-mural-and-rainbow.jpg",
    imageAlt:
      "The glass door, with a painted mural of a tooth character and a rainbow",
  },
  {
    sentence: "I say hello at the reception desk.",
    imageSrc: "/images/reception/reception_height-chart-and-bunny-desk.jpg",
    imageAlt: "The reception desk, with a teal front and the Tic Tac Tooth logo on the wall behind it",
  },
  {
    sentence: "I can stand by the height chart if I want to.",
    imageSrc: "/images/reception/reception_height-chart-and-bunny-desk.jpg",
    imageAlt: "A height chart on the wall with a giraffe, a monkey, a parrot, a tiger and an elephant drawn along it",
  },
  {
    sentence: "I can play in the waiting area until it is my turn.",
    imageSrc: "/images/play-gym/play-gym_climbing-wall-and-cargo-net.jpg",
    imageAlt: "A climbing wall, a rope net and wooden bars in the waiting area",
  },
  {
    sentence: "I choose which room I go into.",
    imageSrc: "/images/consultation/consultation-room_desk-and-arched-doorway.jpg",
    imageAlt: "An arched doorway leading from the consultation room into the jungle room",
  },
  {
    sentence: "I sit in the chair. My parent stays with me the whole time.",
    imageSrc: "/images/rooms/jungle-room_wide-with-ceiling-mural.jpg",
    imageAlt: "The dental chair in the jungle room",
  },
  {
    sentence: "The dentist shows me each tool before using it.",
    imageSrc: "/images/rooms/space-room_wide-from-doorway.jpg",
    imageAlt: "The tray of tools on the arm of the dental chair",
  },
  {
    sentence: "I can look at the picture on the ceiling if I want a break.",
    imageSrc: "/images/rooms/jungle-room_ceiling-mural-lit.jpg",
    imageAlt: "A round picture of jungle animals on the ceiling above the chair, lit up",
  },
  {
    sentence: "When we are finished, I get a sticker and a certificate.",
    imageSrc: "/images/no-cavity-club/no-cavity-club_mascot-mural-and-rainbow.jpg",
    imageAlt: "The wall by the desk that says You did a great job, with a rainbow and two happy teeth",
  },
  {
    sentence: "Then I go home. I did a good job.",
    imageSrc: "/images/entrance/entrance_backlit-sign-dusk.jpg",
    imageAlt: "The Tic Tac Tooth sign by the door",
  },
];


/** Review markers stripped, see lib/content/clean.ts. */
export const socialStoryPages = cleanContent(RAW_SOCIAL_STORY_PAGES);