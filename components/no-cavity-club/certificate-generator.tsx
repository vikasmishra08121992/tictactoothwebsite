"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/mascot";
import { GridFrame } from "@/components/motifs/grid-frame";

export function CertificateGenerator() {
  const [name, setName] = useState("");

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:items-center">
      <div>
        <Label htmlFor="cert-name">Child&apos;s first name</Label>
        <Input
          id="cert-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Aarav"
          className="mt-2"
        />
        <Button
          className="mt-4"
          onClick={() =>
            toast("This is a design mockup", {
              description:
                "The finished version will generate and download a real certificate image.",
            })
          }
        >
          <Download className="size-4" aria-hidden="true" />
          Download certificate
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border-4 border-gold bg-cream p-8 text-center shadow-sm">
        <GridFrame variant="accent" className="mx-auto mb-2 h-6 w-20" />
        <p className="text-xs font-bold uppercase tracking-wide text-teal-text">
          No Cavity Club
        </p>
        <Mascot pose="hero" className="mx-auto mt-2 h-24 w-auto" />
        <p className="mt-3 font-display text-2xl font-bold text-ink">
          {name.trim() || "[Child's name]"}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink/85">
          is a proud Super Smile Saver
        </p>
        <p className="mt-3 font-display text-lg font-bold text-crimson-btn">
          You did a great job!
        </p>
      </div>
    </div>
  );
}
