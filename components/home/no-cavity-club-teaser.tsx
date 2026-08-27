import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { Mascot } from "@/components/mascot/mascot";
import { GridFrame } from "@/components/motifs/grid-frame";

export function NoCavityClubTeaser() {
  return (
    <Section tone="white" size="loose" className="overflow-hidden">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
            <Image
              src="/images/no-cavity-club/no-cavity-club_mascot-mural-and-rainbow.jpg"
              alt="The No Cavity Club mural: the superhero-tooth mascot with a gold shield, and two tooth characters giving thumbs up beneath a rainbow reading 'You did a great job!'"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* the certificate, floating out over the photo */}
          <div className="sticker absolute -bottom-8 -right-2 w-52 rotate-[-5deg] rounded-2xl border-4 border-gold bg-cream p-4 text-center md:-right-6 md:w-60">
            <GridFrame variant="accent" className="mx-auto h-5 w-16" />
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-teal-text">
              No Cavity Club
            </p>
            <Mascot pose="hero" className="mx-auto mt-1 h-20 w-auto" />
            <p className="mt-1 font-display text-lg font-bold text-ink">Aarav</p>
            <p className="text-[11px] font-semibold text-ink/85">
              is a Super Smile Saver
            </p>
            <p className="mt-1.5 font-display text-sm font-bold text-crimson-btn">
              You did a great job!
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Super Smile Savers"
            size="large"
            title="The No Cavity Club, made real."
            description="It is already painted on the wall. We turned it into a brushing chart, a badge system, and a shareable certificate carrying your child's own name — the thing parents actually post."
          />
          <ButtonLink
            href="/no-cavity-club"
            size="lg"
            className="mt-8 h-14 rounded-full px-7 text-base shadow-pop"
          >
            Join the club
            <ArrowRight className="size-5" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
