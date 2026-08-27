import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section, SectionHeading } from "@/components/layout/section";
import { BrushingChart } from "@/components/no-cavity-club/brushing-chart";
import { BadgeSystem } from "@/components/no-cavity-club/badge-system";
import { howTheClubWorks } from "@/lib/content/no-cavity-club";
import { CertificateGenerator } from "@/components/no-cavity-club/certificate-generator";
import { Sticker } from "@/components/ui/sticker";
import { Mascot } from "@/components/mascot/mascot";

export const metadata: Metadata = {
  title: "No Cavity Club",
  description:
    "Super Smile Savers — a brushing chart, badges, and a shareable certificate for every child who visits Tic Tac Tooth.",
};

export default function NoCavityClubPage() {
  return (
    <>
      {/* ---- hero, on the mural itself ---- */}
      <div className="relative isolate overflow-hidden bg-ink">
        <Image
          src="/images/no-cavity-club/no-cavity-club_mascot-mural-and-rainbow.jpg"
          alt="The No Cavity Club mural: the superhero-tooth mascot with a gold shield, and two tooth characters giving thumbs up beneath a rainbow reading 'You did a great job!'"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-30"
        />
        <div className="mx-auto grid max-w-[110rem] items-center gap-10 px-4 py-20 md:grid-cols-[1.2fr_auto] md:px-6 md:py-28">
          <div>
            <Sticker tone="gold" tilt="left">
              Super Smile Savers
            </Sticker>
            <h1 className="mt-6 max-w-2xl text-5xl font-bold text-cream md:text-7xl">
              The No Cavity Club
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/85 md:text-xl">
            It is already painted on the entrance glass at Tic Tac Tooth. Here it is as something your child can actually use — a brushing chart for home, six badges to earn, and a certificate with their own name on it. Every child treated here is in the club from their first visit, free, with nothing to sign up for.
          </p>
          </div>
          <Mascot pose="hero" className="mx-auto hidden h-72 w-auto md:block" />
        </div>
      </div>

      <Section tone="tangerine" size="loose" grain>
        <SectionHeading
          eyebrow="Badges"
          size="large"
          title="Earn them at your check-ups"
          description="Six badges to collect, each handed over in person at the end of an appointment. Every one says what it takes to earn it — because a reward nobody can explain is just a sticker."
        />
        <div className="mt-12">
          <BadgeSystem />
        </div>
      </Section>

      <Section tone="white" size="loose">
        <SectionHeading
          eyebrow="At home"
          size="large"
          title="The brushing chart"
          description="Tap a circle for each brushing session. This is exactly what the printed chart you take home looks like."
        />
        <div className="mt-12">
          <BrushingChart />
        </div>
      </Section>

      <Section tone="wash" size="loose" grain>
        <SectionHeading
          eyebrow="Make it yours"
          size="large"
          title="Certificate generator"
          description="Type a first name and watch it appear. In the finished site this downloads as a real image — parents post these, which is the whole point."
        />
        <div className="mt-12">
          <CertificateGenerator />
        </div>
      </Section>
      <Section tone="cream" size="loose">
        <SectionHeading
          eyebrow="How it works"
          size="large"
          title="The questions parents ask about the club"
          description="It costs nothing and there is nothing to sign up for. Here is the rest of it."
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {howTheClubWorks.map((item) => (
            <div key={item.q} className="rounded-2xl bg-white p-5 shadow-soft">
              <h3 className="font-display text-lg font-bold text-ink">
                {item.q}
              </h3>
              <p className="mt-2 leading-relaxed text-ink/85">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <ClosingCta
        title="Join at your next visit."
        body="Every child treated at Tic Tac Tooth is already a member — from their very first appointment, free, with nothing to sign up for."
        cta="Book an appointment"
      />
    </>
  );
}
