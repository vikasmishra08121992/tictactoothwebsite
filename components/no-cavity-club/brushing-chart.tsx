"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { brushingDays } from "@/lib/content/no-cavity-club";
import { cn } from "@/lib/utils";

export function BrushingChart() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setChecked((c) => ({ ...c, [key]: !c[key] }));

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white p-4">
      <div className="grid min-w-[600px] grid-cols-8 gap-2 text-center text-xs font-bold text-ink/85">
        <div />
        {brushingDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      {(
        [
          { label: "Morning", icon: Sun },
          { label: "Night", icon: Moon },
        ] as const
      ).map(({ label, icon: Icon }) => (
        <div key={label} className="mt-2 grid min-w-[600px] grid-cols-8 items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </div>
          {brushingDays.map((d) => {
            const key = `${label}-${d}`;
            const isOn = checked[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isOn}
                aria-label={`${label} brushing, ${d}`}
                onClick={() => toggle(key)}
                className={cn(
                  "mx-auto flex size-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isOn
                    ? "border-leaf-text bg-leaf/30 text-leaf-text"
                    : "border-ink/15 text-ink/20 hover:border-ink/30"
                )}
              >
                {isOn ? "✓" : ""}
              </button>
            );
          })}
        </div>
      ))}
      <p className="mt-4 text-center text-xs text-ink/85">
        A printable version of this chart is available at your appointment.
      </p>
    </div>
  );
}
