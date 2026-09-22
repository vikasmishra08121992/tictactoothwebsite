import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";

/**
 * The No Cavity Club, as it is on the wall.
 *
 * An earlier version floated a sample certificate over the photograph with a
 * child's first name on it. The site's hard rule is no child's name anywhere,
 * and a sample name is still a name. The photograph of the painted mural
 * carries the section on its own.
 */
export function NoCavityClubTeaser() {
  return (
    <Section tone="gold" size="loose">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src="/images/no-cavity-club/no-cavity-club_mascot-mural-and-rainbow.jpg"
            alt="The No Cavity Club mural on the reception wall: a winking superhero tooth in a gold crown and red cape holding a shield with the Tic Tac Tooth logo, above the words No Cavity Club, Super Smile Savers, and a rainbow"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <SectionHeading
            size="large"
            title="The No Cavity Club"
            description="It is painted on the reception wall, and every child treated here is a member from their first visit. Six badges to earn, a brushing chart for home, and a certificate with your child's name on it."
          />
          <ButtonLink
            href="/no-cavity-club"
            size="lg"
            className="mt-8 h-14 rounded-full px-7 text-base"
          >
            How the club works
            <ArrowRight className="size-5" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
