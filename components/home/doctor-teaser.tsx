import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { doctor } from "@/lib/content/doctor";
import { PHOTO_QUALITY } from "@/lib/images";

/**
 * Anything not yet supplied, the degree, the registration number, the
 * biography, is simply absent rather than shown as a bracketed note. The
 * section says less until the facts arrive.
 */
export function DoctorTeaser() {
  return (
    <Section tone="lavender" size="loose">
      <div className="grid items-center gap-12 md:grid-cols-[auto_1fr] md:gap-16">
        <div className="relative mx-auto aspect-[3/4] w-64 overflow-hidden rounded-3xl md:w-80">
          <Image
            src={doctor.portrait.src}
            alt={doctor.portrait.alt}
            fill
            sizes="(min-width: 768px) 20rem, 16rem"
            quality={PHOTO_QUALITY}
            className="object-cover object-[35%_center]"
          />
        </div>

        <div>
          <p className="mb-3 text-base font-semibold text-teal-text">Meet the doctor</p>
          <h2 className="text-3xl font-bold text-ink md:text-5xl">{doctor.name}</h2>
          <p className="mt-2 text-lg font-semibold text-ink">{doctor.title}</p>
          {doctor.credentials && (
            <p className="mt-1 text-base text-ink/85">{doctor.credentials}</p>
          )}

          <blockquote className="mt-6 max-w-xl border-l-4 border-gold pl-5 font-display text-xl text-ink md:text-2xl">
            &ldquo;{doctor.philosophy}&rdquo;
          </blockquote>

          {doctor.bio && <p className="mt-5 max-w-xl text-lg text-ink/85">{doctor.bio}</p>}

          <ButtonLink
            href="/meet-the-doctor"
            variant="outline"
            size="lg"
            className="mt-7 h-13 rounded-full border-2 border-ink bg-transparent px-6 text-base text-ink hover:bg-ink hover:text-cream"
          >
            About Dr. Chauhan
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
