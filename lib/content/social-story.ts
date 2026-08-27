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
 * Self-contained on purpose — it previously derived its images from the First
 * Visit walkthrough, which the client has since removed. No mascot and no
 * exclamation marks here, per the special-needs register.
 */
export const socialStoryPages: SocialStoryPage[] = [
  {
    sentence: "I am going to Tic Tac Tooth for a dental visit.",
    imageSrc: "/images/entrance/entrance_backlit-sign-dusk.jpg",
    imageAlt:
      "The Tic Tac Tooth entrance — a backlit sign glowing warm gold beside a wood-slat door",
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
    imageAlt: "The reception desk, with a teal front and the clinic logo above it",
  },
  {
    sentence: "I can stand by the height chart if I want to.",
    imageSrc: "/images/reception/reception_height-chart-and-bunny-desk.jpg",
    imageAlt: "A height chart on the wall with animals drawn along it",
  },
  {
    sentence: "I can play in the waiting area until it is my turn.",
    imageSrc: "/images/play-gym/play-gym_climbing-wall-and-cargo-net.jpg",
    imageAlt: "A climbing wall, a rope net and wooden bars in the waiting area",
  },
  {
    sentence: "I choose which room I go into.",
    imageAlt: "[PLACEHOLDER PHOTO: the two room doorways, side by side]",
  },
  {
    sentence: "I sit in the chair. My parent stays with me the whole time.",
    imageSrc: "/images/rooms/jungle-room_wide-with-ceiling-mural.jpg",
    imageAlt: "The dental chair in the jungle room",
  },
  {
    sentence: "The dentist shows me each tool before using it.",
    imageAlt: "[PLACEHOLDER PHOTO: an instrument being shown to a child, hands only]",
  },
  {
    sentence: "I can look at the picture on the ceiling if I want a break.",
    imageSrc: "/images/rooms/jungle-room_wide-with-ceiling-mural.jpg",
    imageAlt: "A round picture on the ceiling above the chair, lit up",
  },
  {
    sentence: "When we are finished, I get a sticker and a certificate.",
    imageAlt: "[PLACEHOLDER PHOTO: a sticker sheet and certificate on the counter]",
  },
  {
    sentence: "Then I go home. I did a good job.",
    imageAlt: "[PLACEHOLDER PHOTO: the door, from the inside, on the way out]",
  },
];
