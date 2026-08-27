import { Section, SectionHeading } from "@/components/layout/section";
import { RoomCard } from "@/components/rooms/room-card";
import { rooms } from "@/lib/content/rooms";

export function RoomsPreview() {
  return (
    <Section tone="lavender" size="loose" grain>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Pick your room"
          size="large"
          title={
            <>
              The space <em className="not-italic text-crimson-btn">is</em> the
              treatment.
            </>
          }
          description="Every child chooses Space or Jungle before we begin. It is a real choice, made by them, and it changes how the whole appointment feels."
        />
      </div>

      <div className="stagger mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
        {rooms.map((room) => (
          <RoomCard key={room.slug} room={room} href="/our-space" />
        ))}
      </div>
    </Section>
  );
}
