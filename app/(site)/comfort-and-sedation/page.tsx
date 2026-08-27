import type { Metadata } from "next";
import { Tv, Sparkles, Wind, MessageSquareText, Quote } from "lucide-react";
import { ClosingCta } from "@/components/layout/closing-cta";
import { Section, SectionHeading } from "@/components/layout/section";
import { Sticker } from "@/components/ui/sticker";
import { Mascot } from "@/components/mascot/mascot";

export const metadata: Metadata = {
  title: "Comfort & Sedation",
  description:
    "Tell-show-do preparation, ceiling TVs, a star and nebula projector, and on-site laughing gas (nitrous oxide) sedation — how we help a child through treatment, honestly.",
};

const layers = [
  {
    icon: MessageSquareText,
    title: "Tell, show, do",
    body: "Before anything touches your child's mouth we tell them what it is, show them how it works — often on a finger or a toy first — then do it. Every time, every instrument.",
    tone: "bg-mint/25",
  },
  {
    icon: Tv,
    title: "Ceiling-mounted TVs",
    body: "Cartoons play on a screen above the chair during treatment. A familiar, predictable thing to look at is worth more than any amount of reassurance.",
    tone: "bg-lavender/35",
  },
  {
    icon: Sparkles,
    title: "Star & nebula projector",
    body: "Turns the room into a night sky. Optional, and switched off the moment a child finds it overstimulating rather than calming — some children love it, some do not, and we follow the child.",
    tone: "bg-blush/25",
  },
  {
    icon: Wind,
    title: "Laughing gas",
    body: "Available on site for children who need extra help getting through treatment comfortably. Administered and monitored by the clinical team, explained to you beforehand, and used only with your consent.",
    tone: "bg-tangerine/25",
  },
];

export default function ComfortAndSedationPage() {
  return (
    <>
      {/* ---- the promise we refuse to make ---- */}
      <Section tone="wash" size="loose" grain>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Sticker tone="cream" tilt="left">
              For the parent bracing for a fight in the car park
            </Sticker>
            <h1 className="mt-6 max-w-2xl text-5xl font-bold text-ink md:text-6xl">
              We are not going to tell you it won&apos;t hurt.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/85 md:text-xl">
              Plenty of clinics advertise painless dentistry. Tic Tac Tooth will not —
              it is a promise that can be broken in the chair, and a child who
              is told it will not hurt and then feels something never fully
              believes an adult in a dental room again.
            </p>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-relaxed text-ink">
              What we will do is tell your child the truth about what they are
              going to feel, and stack everything we have in their favour.
            </p>
          </div>
          <div className="relative flex justify-center">
            <div className="arch h-64 w-56 bg-mint/40 md:h-72 md:w-64" />
            <Mascot
              pose="calm"
              className="absolute -top-6 h-72 w-auto md:h-80"
            />
          </div>
        </div>
      </Section>

      {/* ---- the four layers ---- */}
      <Section tone="white" size="loose">
        <SectionHeading
          eyebrow="What we actually do"
          size="large"
          title="Four things, stacked."
        />
        <div className="stagger mt-12 grid gap-5 sm:grid-cols-2">
          {layers.map(({ icon: Icon, title, body, tone }, i) => (
            <div
              key={title}
              className={`hover-lift rounded-3xl p-7 shadow-soft ${tone}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-white/70 text-ink">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-bold text-ink/85">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-ink">
                {title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-ink/80">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- honesty pull-quote ---- */}
      <Section tone="ink" size="default" grain>
        <figure className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto size-9 text-gold" aria-hidden="true" />
          <blockquote className="mt-5 font-display text-2xl font-bold leading-snug text-cream md:text-4xl">
            &ldquo;Comfortable, gentle, and honest about what you will feel.&rdquo;
          </blockquote>
          <figcaption className="mt-5 text-sm text-cream/75">
            How we describe treatment to every child, in their own words, before
            we start.
          </figcaption>
        </figure>
      </Section>

      {/* ---- beyond laughing gas ---- */}
      <Section tone="lavender" size="loose" grain>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Beyond laughing gas" size="large" title="Further sedation options" />
          <div className="space-y-4 text-lg leading-relaxed text-ink/80">
            <p>
              [CONFIRM: the exact general anaesthetic pathway — in-house or referred, and the
              referral pathway if a child needs care beyond what can safely be
              delivered on site.]
            </p>
            <p className="font-semibold text-ink">
              Whatever the pathway, it is agreed with you in advance — never
              decided on the day without your consent.
            </p>
          </div>
        </div>
      </Section>
      <ClosingCta
        title="Questions before you book? Just call."
        body="Talking it through beforehand is often the single biggest thing that makes the day go well."
        cta="Book an appointment"
      />
    </>
  );
}
