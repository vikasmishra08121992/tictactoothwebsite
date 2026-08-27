import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Sticker } from "@/components/ui/sticker";
import { GridFrame } from "@/components/motifs/grid-frame";
import { Mascot } from "@/components/mascot/mascot";
import { clinic } from "@/lib/content/site";

/** Hand-drawn marker underline, for emphasising one word in the headline. */
function Underline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 10 C48 3, 104 13, 196 5"
        stroke="var(--gold)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

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

      <div className="relative mx-auto grid max-w-[110rem] items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div>
          <Sticker tone="gold" tilt="left" className="animate-rise">
            Maninagar, Ahmedabad · Ages 0–18
          </Sticker>

          <h1 className="animate-rise delay-1 mt-6 text-5xl font-bold text-ink sm:text-6xl lg:text-7xl">
            Dentistry built{" "}
            <span className="relative inline-block">
              around
              <Underline className="absolute -bottom-1 left-0 h-3 w-full" />
            </span>{" "}
            your child.
          </h1>

          <p className="animate-rise delay-2 mt-6 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
            {clinic.name} is a paediatric dental hospital in Maninagar,
            Ahmedabad, treating children and teenagers only — from a first
            tooth to an eighteenth birthday. Two themed treatment rooms your
            child picks between, every instrument explained before it&apos;s
            used, laughing gas sedation on site, and a real pathway for
            children with disabilities and sensory needs.
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
              Call now
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

          <p className="animate-rise delay-4 mt-5 text-sm font-medium text-ink/85">
            Call or WhatsApp us directly — no form needed if your child is in pain.
          </p>
        </div>

        {/* mascot, staged on a bright arch pedestal */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm">
            <div className="shadow-glow-gold absolute inset-x-8 top-16 bottom-8 rounded-full" />
            <div className="arch relative mt-16 h-72 w-full bg-mint md:h-80" />
            <Mascot
              pose="hero"
              className="absolute inset-x-0 -top-2 mx-auto h-[26rem] w-auto md:h-[30rem]"
            />

            <Sticker
              tone="cream"
              tilt="right"
              className="absolute -left-2 top-24 z-10 md:-left-6"
            >
              Laughing gas on site
            </Sticker>
            <Sticker
              tone="coral"
              tilt="left"
              className="absolute -right-1 bottom-10 z-10 md:-right-4"
            >
              Space or Jungle — you choose
            </Sticker>
          </div>
        </div>
      </div>
    </div>
  );
}
