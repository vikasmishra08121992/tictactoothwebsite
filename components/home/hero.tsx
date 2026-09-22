import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Sticker } from "@/components/ui/sticker";
import { GridFrame } from "@/components/motifs/grid-frame";
import { Mascot } from "@/components/mascot/mascot";
import { clinic } from "@/lib/content/site";

export function Hero() {
  return (
    <div className="wash-warm texture-grain relative overflow-hidden bg-cream">
      {/* the logo grid, doing real work as a background motif */}
      <GridFrame
        variant="full"
        className="pointer-events-none absolute -right-24 -top-32 h-[34rem] w-[34rem] opacity-[0.12]"
      />
      <GridFrame
        variant="full"
        className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 opacity-[0.09]"
      />

      <div className="relative mx-auto grid min-h-[min(88vh,60rem)] max-w-[100rem] items-center gap-12 px-6 py-16 sm:px-10 md:px-14 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 xl:px-20">
        <div>
          <Sticker tone="gold" tilt="left" className="animate-rise">
            Maninagar, Ahmedabad · Birth to 18
          </Sticker>

          <h1 className="animate-rise delay-1 mt-6 text-5xl font-bold text-ink sm:text-6xl lg:text-7xl xl:text-8xl">
            Dentistry built around your child.
          </h1>

          <p className="animate-rise delay-2 mt-7 max-w-xl text-xl text-ink/85 xl:text-2xl">
            {clinic.name} treats children and teenagers only, from a first
            tooth to an eighteenth birthday. Your child chooses between two
            themed treatment rooms. Every instrument is explained before it is
            used. Laughing gas is available on site, and children with
            disabilities and sensory needs have a proper pathway, planned in
            advance.
          </p>

          <div className="animate-rise delay-3 mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink
              href="/book"
              size="lg"
              className="h-14 rounded-full px-7 text-base shadow-pop"
            >
              <CalendarCheck className="size-5" aria-hidden="true" />
              Book an appointment
            </ButtonLink>
            <ButtonLink
              href={clinic.phoneHref}
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-2 border-ink bg-white/70 px-6 text-base text-ink hover:bg-ink hover:text-cream"
            >
              <Phone className="size-5" aria-hidden="true" />
              {clinic.phoneDisplay}
            </ButtonLink>
            <ButtonLink
              href={clinic.whatsappHref}
              size="lg"
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 rounded-full border-2 border-leaf-text bg-white/70 px-6 text-base text-leaf-text hover:bg-leaf-text hover:text-white"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              WhatsApp
            </ButtonLink>
          </div>

          <p className="animate-rise delay-4 mt-5 text-base text-ink/85">
            If your child is in pain, call. You do not need the form.
          </p>
        </div>

        {/*
          The mascot, staged on a bright arch pedestal, filling its half.

          The whole composition is driven by WIDTH. An earlier version sized
          the mascot by height (lg:h-[46rem]), which fixed its width at 631px
          from the 240x280 viewBox regardless of how much room the column had
          — at 1024px that put it 185px outside a 446px column, clipped by the
          hero's overflow-hidden. Here the mascot is w-full in normal flow, so
          it can never exceed its column, and the arch and stickers are placed
          as percentages of the height it establishes so they scale with it.
        */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative mx-auto w-[82%] max-w-[20rem] sm:w-full sm:max-w-md lg:mx-0 lg:max-w-none">
            {/* pedestal, behind the mascot, starting below its crown */}
            <div className="absolute inset-x-0 bottom-0 top-[22%]">
              <div className="shadow-glow-gold absolute inset-x-[10%] inset-y-[12%] rounded-full" />
              <div className="arch relative h-full w-full bg-mint" />
            </div>

            <Mascot
              pose="hero"
              className="relative block aspect-[240/280] h-auto w-full"
            />

            <Sticker
              tone="cream"
              tilt="right"
              className="absolute left-0 top-[26%] z-10 text-base sm:-left-4 lg:-left-8"
            >
              Laughing gas on site
            </Sticker>
            <Sticker
              tone="coral"
              tilt="left"
              className="absolute right-0 bottom-[10%] z-10 text-base sm:-right-3 lg:-right-6"
            >
              Space or Jungle, you choose
            </Sticker>
          </div>
        </div>
      </div>
    </div>
  );
}
