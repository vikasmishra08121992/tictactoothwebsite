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

        {/* the mascot, staged on a bright arch pedestal, filling its half */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-2xl">
            <div className="shadow-glow-gold absolute inset-x-10 top-24 bottom-6 rounded-full" />
            <div className="arch relative mt-20 h-[19rem] w-full bg-mint sm:h-[26rem] lg:h-[32rem]" />
            <Mascot
              pose="hero"
              className="absolute inset-x-0 -top-4 mx-auto h-auto w-[86%] max-w-[22rem] sm:h-[36rem] sm:w-auto sm:max-w-none lg:h-[46rem]"
            />

            <Sticker
              tone="cream"
              tilt="right"
              className="absolute left-0 top-28 z-10 text-base sm:-left-4 lg:-left-8 lg:top-36"
            >
              Laughing gas on site
            </Sticker>
            <Sticker
              tone="coral"
              tilt="left"
              className="absolute right-0 bottom-12 z-10 text-base sm:-right-3 lg:-right-6 lg:bottom-16"
            >
              Space or Jungle, you choose
            </Sticker>
          </div>
        </div>
      </div>
    </div>
  );
}
