import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Room } from "@/lib/content/rooms";
import { StarfieldPlaceholder } from "@/components/rooms/room-media";
import { cn } from "@/lib/utils";

export function RoomCard({ room, href }: { room: Room; href: string }) {
  const isSpace = room.slug === "space";

  return (
    <Link
      href={href}
      className={cn(
        "hover-lift group relative flex flex-col overflow-hidden rounded-3xl shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
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
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <StarfieldPlaceholder label={room.imageAlt} />
        )}

        <span
          className={cn(
            "absolute left-5 top-5 flex size-12 items-center justify-center rounded-full font-display text-lg font-bold shadow-soft",
            isSpace ? "bg-lavender text-midnight" : "bg-camel-text text-cream"
          )}
          aria-hidden="true"
        >
          {isSpace ? "01" : "02"}
        </span>

        {room.teenSuitable && (
          <span className="absolute right-5 top-5 rounded-full bg-cream/95 px-3 py-1.5 text-xs font-bold text-midnight shadow-soft">
            Teen default
          </span>
        )}
      </div>

      <div className="texture-grain flex flex-1 flex-col p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-cream/75">
          {room.tagline}
        </p>
        <h3 className="mt-1.5 font-display text-3xl font-bold text-cream md:text-4xl">
          {room.name}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-cream/75">
          {room.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {room.palette.map((chip) => (
            <li
              key={chip}
              className="rounded-full bg-cream/15 px-3 py-1 text-xs font-semibold capitalize text-cream"
            >
              {chip}
            </li>
          ))}
        </ul>

        <span className="mt-6 inline-flex items-center gap-2 font-display text-base font-bold text-gold">
          Take the tour
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
