import { Section, SectionHeading } from "@/components/layout/section";
import { RoomCard } from "@/components/rooms/room-card";
import { rooms } from "@/lib/content/rooms";

export function RoomsPreview() {
  return (
    <Section tone="lavender" size="loose">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Two treatment rooms"
          size="large"
          title="Your child picks the room"
          description="Your child chooses Space or Jungle before anything begins. It is a small choice, and for many children the first they have ever been given in a medical appointment."
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
