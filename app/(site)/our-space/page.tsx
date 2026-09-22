import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Sticker } from "@/components/ui/sticker";
import { Section, SectionHeading } from "@/components/layout/section";
import { RoomMedia } from "@/components/rooms/room-media";
import { rooms } from "@/lib/content/rooms";
import { PHOTO_QUALITY } from "@/lib/images";

export const metadata: Metadata = {
  title: "Our Space",
  description:
    "A photo tour of Tic Tac Tooth, the Space and Jungle treatment rooms, the ceiling murals above each chair, the play gym, reception, the consultation room and sterilisation.",
};

/**
 * The photo tour, in the order a visitor walks through the building.
 *
 * All photographs are the client's own, taken in the finished hospital. No
 * child appears in any of them, the hard rule in DECISIONS.md, and every
 * alt text describes what is actually in the frame rather than what a
 * caption would like it to evoke.
 */
/*
 * The grid is sm:grid-cols-3 with a 20px gap, so a tile is either two columns
 * wide (~63vw of the viewport) or one (~31vw), and full width below sm. One
 * `sizes` string cannot describe both: the earlier single value of 40vw
 * understated the wide tiles by a third and the browser fetched a 640px
 * candidate for a 634px box — half what a 2x screen needs, which is what made
 * the gallery look soft. Derived from `span` so the two cannot drift apart.
 */
const WIDE_TILE_SIZES = "(min-width: 640px) 65vw, 100vw";
const NARROW_TILE_SIZES = "(min-width: 640px) 33vw, 100vw";

const galleryShots = [
  {
    src: "/images/rooms/space-room_wide-from-doorway.jpg",
    alt: "Smiling Adventures treatment room from the doorway, a navy dental chair with an instrument tray, a 'Space for Healthy Smiles!' mural of tooth characters on a ringed planet, and a UFO above the cloudscape",
    caption: "Smiling Adventures, the space room",
    span: "sm:col-span-2",
  },
  {
    src: "/images/rooms/space-room_mural-rocket-and-ufo.jpg",
    alt: "The space room mural, a blue rocket, a UFO and ringed planets over a pale blue cloudscape, above the granite counter and sink",
    caption: "Rockets over the cloudscape",
    span: "",
  },
  {
    src: "/images/rooms/jungle-room_wide-with-glass-partition.jpg",
    alt: "Jungle Smiles treatment room, a camel-leather chair beneath the 'Jungle Smiles, Super Bright!' mural, beside an etched jungle-glass partition with palm trees and a zebra",
    caption: "Jungle Smiles, the jungle room",
    span: "",
  },
  {
    src: "/images/rooms/jungle-room_mural-wall-detail.jpg",
    alt: "The jungle room's watercolour mural, a sloth on a vine, a monkey, a tiger, an elephant, a giraffe, a zebra and a lion on a rock among palm trees",
    caption: "The watercolour jungle",
    span: "sm:col-span-2",
  },
  {
    src: "/images/play-gym/play-gym_wide-establishing.jpg",
    alt: "The play gym, a teal cloud-and-raindrop wall sculpture, a yellow tree bookshelf on a green disc, bench seating, and a wooden climbing frame with wall bars, a climbing board, a cargo net and soft animal toys",
    caption: "The play gym",
    span: "sm:col-span-2",
  },
  {
    src: "/images/play-gym/play-gym_tree-shelf-books-detail.jpg",
    alt: "The tree bookshelf up close, picture books in Gujarati and English, crocheted toys on the branches, a wooden noughts-and-crosses board and an abacus",
    caption: "The reading corner",
    span: "",
  },
  {
    src: "/images/reception/reception_height-chart-and-bunny-desk.jpg",
    alt: "Reception, the Tic Tac Tooth Kids Dental Hospital logo on the wall behind the desk, beside a jungle-animal height chart with a giraffe, monkey, parrot, tiger and elephant",
    caption: "Reception & the height chart",
    span: "",
  },
  {
    src: "/images/no-cavity-club/no-cavity-club_mural-and-reception.jpg",
    alt: "The No Cavity Club mural beside reception, a winking superhero tooth in a gold crown and red cape holding a shield with the Tic Tac Tooth logo, above 'Super Smile Savers!' and a rainbow",
    caption: "The No Cavity Club wall",
    span: "sm:col-span-2",
  },
];

export default function OurSpacePage() {
  return (
    <>
      {/* ---- intro, sat directly on the entrance photograph ---- */}
      <div className="relative isolate overflow-hidden bg-ink">
        <Image
          src="/images/entrance/entrance_backlit-sign-dusk.jpg"
          alt="The Tic Tac Tooth Kids Dental Hospital entrance sign, dimensional pastel letters on a noughts-and-crosses grid, edge-lit in warm gold"
          fill
          // `priority` is deprecated in Next 16. This photograph is the LCP
          // element on this route, so it preloads from <head>.
          preload
          sizes="100vw"
          quality={PHOTO_QUALITY}
          className="-z-10 object-cover opacity-35"
        />
        <div className="mx-auto max-w-[110rem] px-4 py-24 text-center md:px-6 md:py-32">
          <Sticker tone="gold" tilt="left">
            Take the tour
          </Sticker>
          <h1 className="mt-6 mx-auto mt-6 max-w-3xl text-5xl font-bold text-cream md:text-7xl">
            The hospital, room by room.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/75 md:text-xl">
            This is Tic Tac Tooth, photographed rather than described. Start at the
            door and walk in.
          </p>
        </div>
      </div>

      {/* ---- the two rooms, alternating, colour-blocked ---- */}
      {rooms.map((room, i) => {
        const isSpace = room.slug === "space";
        return (
          <Section
            key={room.slug}
            tone={isSpace ? "midnight" : "cream"}
            size="loose"
          >
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <p
                  className={`text-base font-semibold ${
                    isSpace ? "text-cream/85" : "text-teal-text"
                  }`}
                >
                  {room.tagline}
                </p>
                <h2
                  className={`mt-1 text-4xl font-bold md:text-6xl ${
                    isSpace ? "text-cream" : "text-ink"
                  }`}
                >
                  {room.name}
                </h2>
                <p
                  className={`mt-5 max-w-lg text-lg leading-relaxed ${
                    isSpace ? "text-cream/75" : "text-ink/85"
                  }`}
                >
                  {room.description}
                </p>

                <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {room.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-start gap-2.5 text-sm ${
                        isSpace ? "text-cream/75" : "text-ink/75"
                      }`}
                    >
                      <span
                        className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                          isSpace ? "bg-gold" : "bg-teal"
                        }`}
                        aria-hidden="true"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {room.teenSuitable && (
                  <p className="mt-7 inline-block rounded-full bg-lavender px-4 py-2 text-sm font-bold text-midnight">
                    Our default room for teen patients
                  </p>
                )}
              </div>

              <div className={`grid gap-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <RoomMedia
                    src={room.imageSrc}
                    alt={room.imageAlt}
                    /* single column until lg, where this grid splits in two */
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                </div>
                <figure>
                  <div className="relative aspect-[3/4] max-h-[26rem] w-full overflow-hidden rounded-3xl sm:aspect-[4/3]">
                    <Image
                      src={room.ceilingSrc}
                      alt={room.ceilingAlt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      quality={PHOTO_QUALITY}
                      className="object-cover"
                    />
                  </div>
                  <figcaption
                    className={`mt-3 text-base ${
                      isSpace ? "text-cream/85" : "text-ink/85"
                    }`}
                  >
                    The backlit ceiling mural, directly above the chair, for the
                    whole appointment.
                  </figcaption>
                </figure>
              </div>
            </div>
          </Section>
        );
      })}

      {/* ---- the rest of the hospital ---- */}
      <Section tone="white" size="loose">
        <SectionHeading
          eyebrow="Around the hospital"
          size="large"
          title="Reception and the play gym"
          align="center"
        />
        <div className="stagger mt-12 grid gap-5 sm:grid-cols-3">
          {galleryShots.map((shot) => (
            <figure
              key={shot.src}
              className={`overflow-hidden rounded-3xl bg-cream shadow-soft ${shot.span}`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes={shot.span ? WIDE_TILE_SIZES : NARROW_TILE_SIZES}
                  quality={PHOTO_QUALITY}
                  className="object-cover"
                />
              </div>
              <figcaption className="p-4 text-sm font-semibold text-ink/85">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ---- consult room + sterilisation, in the trust register ---- */}
      <Section tone="blush" size="loose">
        <SectionHeading
          eyebrow="Behind the scenes"
          size="large"
          title="The consultation room"
          description="Botanical wallpaper, a wood desk, framed qualifications, and an arched doorway through to the treatment rooms. No dental chair. It is where the clinical conversation happens, sitting down, before anything is decided."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/consultation/consultation-room_desk-and-arched-doorway.jpg"
              alt="The consultation room: a wood desk and two chairs in front of botanical wallpaper, framed qualifications on a shelf, and an arched doorway through to the jungle treatment room"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={PHOTO_QUALITY}
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/doctor/doctor_at-desk.jpg"
              alt="Dr. Roshni Chauhan at the consultation-room desk"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={PHOTO_QUALITY}
              className="object-cover object-[40%_center]"
            />
          </div>
        </div>
      </Section>
      <ClosingCta
        title="Come and see both rooms"
        body="Your child picks Space or Jungle when they arrive."
        cta="Book an appointment"
      />
    </>
  );
}
