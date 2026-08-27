import Image from "next/image";
import { Section, SectionHeading } from "@/components/layout/section";
import { Sticker } from "@/components/ui/sticker";

export function PlayGymSection() {
  return (
    <Section tone="mint" size="loose" grain>
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Before you're even called in"
            size="large"
            title="Waiting time is playtime."
            description="Wooden wall bars with pastel rungs, a red cargo net, a climbing wall, gymnastic rings, a tree-shaped bookshelf and a road-print play mat. Most children have to be persuaded to leave it."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Sticker tone="cream" tilt="left">Climbing wall</Sticker>
            <Sticker tone="coral" tilt="right">Cargo net</Sticker>
            <Sticker tone="lavender" tilt="left">Reading tree</Sticker>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-lift">
            <Image
              src="/images/play-gym/play-gym_climbing-wall-and-cargo-net.jpg"
              alt="Play gym climbing wall with coloured holds and a red cargo net, beside wooden wall bars with pastel rungs"
              fill
              sizes="(min-width: 1024px) 30vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-3xl shadow-lift">
            <Image
              src="/images/play-gym/play-gym_tree-shelf-and-cloud-wall.jpg"
              alt="Yellow tree-shaped bookshelf on a green disc beneath a teal cloud-and-raindrop wall sculpture, with bench seating"
              fill
              sizes="(min-width: 1024px) 30vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
