import Image from "next/image";
import { Section, SectionHeading } from "@/components/layout/section";
import { PHOTO_QUALITY } from "@/lib/images";

export function PlayGymSection() {
  return (
    <Section tone="lime" size="loose">
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="The waiting area"
            size="large"
            title="A play gym, not a waiting room."
            description="Wall bars, a climbing board, a cargo net, gymnastic rings, a tree-shaped bookshelf with picture books in Gujarati and English, and a road-map play mat. Most children have to be persuaded to leave it."
          />
          <div className="mt-8 flex flex-wrap gap-3">
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-lift">
            <Image
              src="/images/play-gym/play-gym_climbing-wall-and-cargo-net.jpg"
              alt="The play gym, a wooden climbing frame with pastel wall bars, a climbing board with coloured holds, a red cargo net and soft toy animals, above a road-map play mat"
              fill
              sizes="(min-width: 1024px) 30vw, 45vw"
              quality={PHOTO_QUALITY}
              className="object-cover"
            />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-3xl shadow-lift">
            <Image
              src="/images/play-gym/play-gym_tree-shelf-and-cloud-wall.jpg"
              alt="The play gym's reading side, a teal cloud-and-raindrop wall sculpture, a yellow tree bookshelf on a green disc, and bench seating with the climbing frame beyond"
              fill
              sizes="(min-width: 1024px) 30vw, 45vw"
              quality={PHOTO_QUALITY}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
