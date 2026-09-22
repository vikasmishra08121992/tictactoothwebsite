import { cleanContent } from "@/lib/content/clean";
export type Room = {
  slug: "space" | "jungle";
  name: string;
  tagline: string;
  /** The slogan painted on the room's wall, exactly as written. */
  slogan: string;
  description: string;
  palette: string[];
  features: string[];
  imageAlt: string;
  imageSrc: string;
  /** The backlit ceiling mural above the chair, lit. */
  ceilingSrc: string;
  ceilingAlt: string;
  teenSuitable: boolean;
};

const RAW_ROOMS: Room[]  = [
  {
    slug: "space",
    name: "Smiling Adventures",
    tagline: "The outer-space room",
    /** Painted on the wall above the chair. */
    slogan: "Space for Healthy Smiles!",
    description:
      "A navy dental chair under a pale blue cloudscape, with a rocket, a UFO and planets on the walls and a TV on the ceiling. Calm, cool colours.",
    palette: ["midnight", "lavender", "cyan"],
    features: [
      "Navy dental chair",
      "Pale blue cloudscape mural with a rocket, a UFO and planets",
      "Backlit circular ceiling mural, glowing warm gold",
      "Ceiling-mounted TV for cartoons during treatment",
      "Star and nebula projector",
      "Laughing gas (nitrous oxide) unit on site",
    ],
    imageAlt:
      "Smiling Adventures treatment room, a navy dental chair beneath a ceiling-mounted TV and a backlit circular ceiling mural, with a 'Space for Healthy Smiles!' astronaut-tooth mural on the wall behind",
    imageSrc: "/images/rooms/space-room_chair-tv-and-ceiling-mural.jpg",
    ceilingSrc: "/images/rooms/space-room_ceiling-mural-lit.jpg",
    ceilingAlt:
      "The space room's backlit circular ceiling mural, lit warm gold above the navy chair, with the cloud and rocket mural on the wall and a frosted glass door",
    teenSuitable: true,
  },
  {
    slug: "jungle",
    name: "Jungle Smiles",
    tagline: "The jungle room",
    /** Painted on the wall above the chair. */
    slogan: "Jungle Smiles, Super Bright! / Healthy Teeth, Happy Times!",
    description:
      "A camel-leather chair beneath sage cabinetry and a watercolour jungle: a lion brushing its teeth, an elephant with a mirror, a monkey with toothpaste, a giraffe looking on. An etched jungle-glass partition finishes the room.",
    palette: ["sage", "camel", "teal"],
    features: [
      "Camel leather dental chair",
      "Sage cabinetry",
      "Watercolour jungle-animal mural",
      "Backlit circular ceiling mural, glowing warm gold",
      "Ceiling-mounted TV for cartoons during treatment",
      "Etched jungle-glass partition",
      "Laughing gas (nitrous oxide) unit on site",
    ],
    imageAlt:
      "Jungle Smiles treatment room, a camel-leather dental chair beneath a 'Jungle Smiles, Super Bright!' mural of a lion brushing its teeth, an elephant with a mirror and a monkey with toothpaste, with sage cabinetry and the laughing gas unit beside the chair",
    imageSrc: "/images/rooms/jungle-room_wide-with-ceiling-mural.jpg",
    ceilingSrc: "/images/rooms/jungle-room_ceiling-mural-lit.jpg",
    ceilingAlt:
      "The jungle room's backlit circular ceiling mural, lit warm gold above the camel chair, showing a monkey on a branch, a lion, a toucan and an elephant",
    teenSuitable: false,
  },
];


/** Review markers stripped, see lib/content/clean.ts. */
export const rooms = cleanContent(RAW_ROOMS);