export type Room = {
  slug: "space" | "jungle";
  name: string;
  tagline: string;
  description: string;
  palette: string[];
  features: string[];
  imageAlt: string;
  imageSrc: string;
  teenSuitable: boolean;
};

export const rooms: Room[] = [
  {
    slug: "space",
    name: "Smiling Adventures",
    tagline: "The outer-space room",
    description:
      "A navy dental chair under a lavender cloudscape, with rockets, UFOs and planets on the walls, and an astronaut-tooth character keeping watch. Calm, cool colours and a mature palette — our teen patients pick this room by default.",
    palette: ["midnight", "lavender", "cyan"],
    features: [
      "Navy dental chair",
      "Lavender cloudscape mural",
      "Backlit circular ceiling mural, glowing warm gold",
      "Ceiling-mounted TV for cartoons during treatment",
      "Star and nebula projector",
      "Laughing gas (nitrous oxide) unit on site",
    ],
    imageAlt: "[PLACEHOLDER PHOTO: Smiling Adventures space-themed treatment room, navy chair and lavender mural — reshoot priority, see /images/README.md]",
    imageSrc: "",
    teenSuitable: true,
  },
  {
    slug: "jungle",
    name: "Jungle Smiles",
    tagline: "The jungle room",
    description:
      "A camel-leather chair beneath sage cabinetry and a hand-painted watercolour mural — a lion brushing its teeth, an elephant with a mirror, a monkey with toothpaste, a giraffe looking on. An etched jungle-glass partition finishes the room.",
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
    imageAlt: "Jungle Smiles treatment room — camel chair, jungle mural of a lion brushing its teeth, and a backlit circular ceiling mural glowing warm gold above the chair",
    imageSrc: "/images/rooms/jungle-room_wide-with-ceiling-mural.jpg",
    teenSuitable: false,
  },
];
