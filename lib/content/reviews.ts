export type Review = {
  name: string;
  rating: number;
  text: string;
  date: string;
};

/** [REAL GOOGLE REVIEWS TO BE SUPPLIED] — the four below are placeholder
 * shape/length only, clearly marked, so the layout can be judged. */
export const reviews: Review[] = [
  {
    name: "[PLACEHOLDER: reviewer name]",
    rating: 5,
    text: "[PLACEHOLDER REVIEW: replace with a real, permission-cleared Google review of comparable length.]",
    date: "[PLACEHOLDER: date]",
  },
  {
    name: "[PLACEHOLDER: reviewer name]",
    rating: 5,
    text: "[PLACEHOLDER REVIEW: replace with a real, permission-cleared Google review of comparable length.]",
    date: "[PLACEHOLDER: date]",
  },
  {
    name: "[PLACEHOLDER: reviewer name]",
    rating: 5,
    text: "[PLACEHOLDER REVIEW: replace with a real, permission-cleared Google review of comparable length.]",
    date: "[PLACEHOLDER: date]",
  },
];

export const reviewStats = {
  average: "[PLACEHOLDER: average rating]",
  count: "[PLACEHOLDER: review count]",
  source: "Google Reviews",
  /** Link out so a parent can verify the reviews are real rather than trust us. */
  profileUrl: "[PLACEHOLDER: Google Business Profile URL for Tic Tac Tooth]",
};

/**
 * [CONFIRM] How reviews are gathered — whether parents are ever asked to leave
 * one, and whether anything is offered in return. The page must not claim
 * reviews are unsolicited unless that is actually true; the current wording
 * deliberately says only that they come from Google and links out so a parent
 * can check for themselves.
 */
