import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Room } from "@/lib/content/rooms";
import { StarfieldPlaceholder } from "@/components/rooms/room-media";
import { cn } from "@/lib/utils";

/**
 * One room: the photograph, the name, what is in it.
 *
 * Each room's card wears its own colour: midnight for space, deep sage for
 * jungle. The photograph does the rest.
 */
export function RoomCard({ room, href }: { room: Room; href: string }) {
  const isSpace = room.slug === "space";
  return (
    <Link
      href={href}
      className={cn(
        "hover-lift group flex flex-col overflow-hidden rounded-3xl shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        // sage at full strength is a mid-tone: cream text lands at 3.2:1 and
        // gold at 2.0:1 against it. sage-deep keeps the jungle hue and clears AA.
        isSpace ? "bg-midnight" : "bg-sage-deep"
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        {room.imageSrc ? (
          <Image
            src={room.imageSrc}
            alt={room.imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <StarfieldPlaceholder label={room.imageAlt} />
        )}
      </div>

      <div className="texture-grain flex flex-1 flex-col p-6 md:p-8">
        <p className="text-base font-semibold text-cream/85">{room.tagline}</p>
        <h3 className="mt-1 font-display text-3xl font-bold text-cream md:text-4xl">
          {room.name}
        </h3>
        <p className="mt-3 text-lg text-cream/85">{room.description}</p>
        {room.teenSuitable && (
          <p className="mt-3 text-base text-cream/85">
            Most teenagers choose this room.
          </p>
        )}

        <span className="mt-6 inline-flex items-center gap-2 text-base font-bold text-gold">
          See the room
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
