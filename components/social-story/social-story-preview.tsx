"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { socialStoryPages } from "@/lib/content/social-story";

export function SocialStoryPreview() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {socialStoryPages.map((page, i) => (
          <figure
            key={i}
            className="overflow-hidden rounded-xl border border-ink/10 bg-white"
          >
            <div className="relative aspect-square bg-ink/5">
              {page.imageSrc ? (
                <Image
                  src={page.imageSrc}
                  alt={page.imageAlt}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-2 text-center text-[10px] font-semibold text-ink/85">
                  {page.imageAlt}
                </div>
              )}
            </div>
            <figcaption className="p-2 text-center text-xs font-medium leading-snug text-ink">
              {i + 1}. {page.sentence}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          onClick={() =>
            toast("This is a design mockup", {
              description:
                "The finished version will download a real, print-ready PDF of this social story.",
            })
          }
        >
          <Download className="size-4" aria-hidden="true" />
          Download the social story (PDF)
        </Button>
      </div>
    </div>
  );
}
