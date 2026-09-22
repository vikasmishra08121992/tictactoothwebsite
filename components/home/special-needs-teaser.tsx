import Image from "next/image";
import { ArrowRight, Ear, Clock3, Users, FileDown } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { clinic } from "@/lib/content/site";

const points = [
  { icon: Ear, label: "Sensory-friendly, low-stimulation appointments" },
  { icon: Clock3, label: "Longer slots and no-treatment visits to get used to the room" },
  { icon: Users, label: "You stay with your child the whole way through" },
  { icon: FileDown, label: "A printable social story to prepare at home" },
];

/**
 * An earlier version led with a "1 in 5" statistic in a dark arch. The
 * number had no source. It is gone, and so is the heading that called this
 * "the audience every other clinic ignores", which was a comparison the
 * brief does not allow and a tone the client does not want. The photograph
 * of the consultation room takes its place: it is the quiet room a first
 * conversation happens in.
 */
export function SpecialNeedsTeaser() {
  return (
    <Section tone="white" size="loose">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src="/images/doctor/doctor_at-desk.jpg"
            alt="The consultation room at Tic Tac Tooth, with a wood desk and no dental chair, where the first conversation happens"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-[40%_center]"
          />
        </div>

        <div>
          <p className="mb-3 text-base font-semibold text-teal-text">
            Special needs and inclusive care
          </p>
          <h2 className="text-4xl font-bold text-ink md:text-5xl lg:text-6xl">
            Every child is welcome here.
          </h2>
          <p className="mt-5 max-w-xl text-xl text-ink/85">
            {clinic.name} treats children with autism, ADHD, Down syndrome,
            cerebral palsy and sensory processing differences. What we can
            offer is set out plainly, so you can decide whether it fits your
            child before you book.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {points.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-3 rounded-2xl border border-tint-line bg-tint p-4"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-teal-text" aria-hidden="true" />
                <span className="text-base text-ink/85">{label}</span>
              </li>
            ))}
          </ul>

          <ButtonLink
            href="/special-needs"
            size="lg"
            className="mt-8 h-14 rounded-full px-7 text-base"
          >
            What we can offer
            <ArrowRight className="size-5" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
