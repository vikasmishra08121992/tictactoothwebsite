import { Hero } from "@/components/home/hero";
import { RoomsPreview } from "@/components/home/rooms-preview";
import { TreatmentsPreview } from "@/components/home/treatments-preview";
import { PlayGymSection } from "@/components/home/play-gym-section";
import { SpecialNeedsTeaser } from "@/components/home/special-needs-teaser";
import { NoCavityClubTeaser } from "@/components/home/no-cavity-club-teaser";
import { DoctorTeaser } from "@/components/home/doctor-teaser";
import { TrustBar } from "@/components/home/trust-bar";
import { ReviewsPreview } from "@/components/home/reviews-preview";
import { LocationTeaser } from "@/components/home/location-teaser";
import { ClosingCta } from "@/components/layout/closing-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <RoomsPreview />
      <TreatmentsPreview />
      <PlayGymSection />
      <SpecialNeedsTeaser />
      <NoCavityClubTeaser />
      <DoctorTeaser />
      <ReviewsPreview />
      <LocationTeaser />
      <ClosingCta />
    </>
  );
}
