import { cleanContent } from "@/lib/content/clean";
/**
 * The doctor.
 *
 * The name comes from the nameplate on the consultation-room desk, legible in
 * the client's own photograph: "Dr. Roshni Chauhan. Pediatric Dentist". That
 * is evidence, not invention, so it is used. Everything the photograph does
 * not show, the degree, the registration number, the biography, stays a
 * placeholder. A framed certificate is visible on the shelf behind the desk
 * but cannot be read at this resolution, and guessing at what it says would
 * be exactly the kind of invented fact this site refuses to carry.
 *
 * "Pediatric Dentist" is the title on the nameplate and is kept verbatim,
 * including the American spelling, because it is what the client chose to
 * have made. The site's own copy uses "paediatric" everywhere else.
 */
const RAW_DOCTOR = {
  name: "Dr. Roshni Chauhan",
  title: "Pediatric Dentist",
  /** Supplied by the client. Also serves as the hospital contact number, see site.ts. */
  mobile: "+91 76980 99176",
  /** Supplied by the client. */
  credentials: "BDS, MDS (Paediatric and Preventive Dentistry)",
  registrationNumber: "[PLACEHOLDER: Gujarat Dental Council registration number]",
  bio: "[PLACEHOLDER: 2–3 sentence clinical biography, training, special interests, and approach to paediatric and special-needs dentistry, to be supplied by the client and clinically reviewed before publishing.] [CLINICAL REVIEW REQUIRED]",
  philosophy:
    "Every child leaves knowing what happened to them and why, comfortable, gentle, and honest about what they'll feel, never told it won't hurt when it might.",

  /** Portrait in the consultation room, an adult, so no consent issue. */
  portrait: {
    src: "/images/doctor/doctor_portrait-consultation-room.jpg",
    alt: "Dr. Roshni Chauhan at her desk in the Tic Tac Tooth consultation room, with tooth models, a laptop and a nameplate reading 'Pediatric Dentist'",
  },
  atWork: {
    src: "/images/doctor/doctor_at-desk.jpg",
    alt: "Dr. Roshni Chauhan working at a laptop in the consultation room",
  },
} as const;


/** Review markers stripped, see lib/content/clean.ts. */
export const doctor = cleanContent(RAW_DOCTOR);