import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section, SectionHeading } from "@/components/layout/section";
import { RoomMedia } from "@/components/rooms/room-media";
import { ArchMask } from "@/components/motifs/arch-mask";
import { Sticker } from "@/components/ui/sticker";
import { rooms } from "@/lib/content/rooms";

export const metadata: Metadata = {
  title: "Our Space",
  description:
    "A photo tour of Tic Tac Tooth — the Space and Jungle treatment rooms, the ceiling murals above each chair, the play gym, reception, the consultation room and sterilisation.",
};

const galleryShots = [
  {
    src: "/images/rooms/jungle-room_mural-wall-detail.jpg",
    alt: "'Jungle Smiles, Super Bright!' wall mural — a monkey, an elephant with a mirror, a lion brushing its teeth, and a giraffe",
    caption: "The Jungle Smiles mural",
    span: "sm:col-span-2",
  },
  {
    src: "/images/play-gym/play-gym_tree-shelf-and-cloud-wall.jpg",
    alt: "Yellow tree-shaped bookshelf on a green disc beneath a teal cloud-and-raindrop wall sculpture, with bench seating",
    caption: "The reading corner",
    span: "",
  },
  {
    src: "/images/reception/reception_height-chart-and-bunny-desk.jpg",
    alt: "Reception desk with a teal bunny-ear cutout beneath the Tic Tac Tooth logo, beside the jungle-animal height chart",
    caption: "Reception & the height chart",
    span: "",
  },
  {
    src: "/images/play-gym/play-gym_climbing-wall-and-cargo-net.jpg",
    alt: "Play gym climbing wall with coloured holds, a red cargo net, and wooden wall bars with pastel rungs",
    caption: "The play gym",
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
          alt="The Tic Tac Tooth entrance — a backlit dimensional sign glowing warm gold beside the wood-slat door"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-35"
        />
        <div className="mx-auto max-w-[110rem] px-4 py-24 text-center md:px-6 md:py-32">
          <Sticker tone="gold" tilt="left">
            Take the tour
          </Sticker>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold text-cream md:text-7xl">
            Every corner, on purpose.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/75 md:text-xl">
            Child-friendly is easy to claim and hard to show. This is Tic Tac
            Tooth, photographed rather than described — start at the door and
            walk in.
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
            grain
          >
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <span
                  className={`font-display text-6xl font-bold ${
                    isSpace ? "text-lavender" : "text-sage-deep"
                  }`}
                  aria-hidden="true"
                >
                  {isSpace ? "01" : "02"}
                </span>
                <p
                  className={`mt-2 text-xs font-bold uppercase tracking-[0.14em] ${
                    isSpace ? "text-lavender" : "text-teal-text"
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

              <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
                  <RoomMedia src={room.imageSrc} alt={room.imageAlt} />
                </div>
                <p
                  className={`mt-4 text-center text-sm ${
                    isSpace ? "text-cream/75" : "text-ink/85"
                  }`}
                >
                  The backlit ceiling mural glows warm gold directly above this
                  chair, for the whole appointment.
                </p>
              </div>
            </div>
          </Section>
        );
      })}

      {/* ---- the rest of the hospital ---- */}
      <Section tone="white" size="loose">
        <SectionHeading
          eyebrow="The rest of the hospital"
          size="large"
          title="Reception, the height chart, and the play gym."
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
                  sizes="(min-width: 640px) 40vw, 100vw"
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
      <Section tone="blush" size="loose" grain>
        <SectionHeading
          eyebrow="Behind the scenes"
          size="large"
          title="The consultation room."
          description="The consultation room is deliberately unlike the operatories — greige botanical wallpaper, a wood desk, an arched doorway, framed qualifications. It is where the clinical conversation happens."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 md:gap-12">
          <div>
            <ArchMask className="shadow-lift">
              <div className="flex aspect-[3/4] w-full items-end bg-greige/35 p-6">
                <p className="text-xs leading-snug text-ink">
                  [PLACEHOLDER PHOTO: consultation room — greige botanical
                  wallpaper, wood desk, arched doorway, framed qualifications]
                </p>
              </div>
            </ArchMask>
            <p className="mt-4 font-display text-lg font-bold text-ink">
              Consultation room
            </p>
          </div>
          <div>
            <ArchMask className="shadow-lift">
              <div className="flex aspect-[3/4] w-full items-end bg-mint/30 p-6">
                <p className="text-xs leading-snug text-ink">
                  [PLACEHOLDER PHOTO: sterilisation area — instruments and
                  process, shot to be shown to parents on request]
                </p>
              </div>
            </ArchMask>
            <p className="mt-4 font-display text-lg font-bold text-ink">
              Sterilisation
            </p>
          </div>
        </div>
      </Section>
      <ClosingCta
        title="Ready to pick a room?"
        body="Your child picks Space or Jungle when they arrive. Come and see both."
        cta="Book an appointment"
      />
    </>
  );
}
