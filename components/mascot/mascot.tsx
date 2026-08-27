import { cn } from "@/lib/utils";

export type MascotPose = "hero" | "calm" | "brushing" | "sleeping";

const poseLabels: Record<MascotPose, string> = {
  hero: "The Tic Tac Tooth mascot — a smiling tooth in a gold crown and red cape, one fist raised, holding a gold shield with the Tic Tac Tooth logo",
  calm: "The Tic Tac Tooth mascot — a smiling tooth in a gold crown, standing calmly with a reassuring expression",
  brushing:
    "The Tic Tac Tooth mascot — a smiling tooth in a gold crown, brushing with a toothbrush",
  sleeping:
    "The Tic Tac Tooth mascot — a tooth in a gold crown, sleeping peacefully",
};

/**
 * [CLIENT TO NAME] — the superhero-tooth mascot, drawn from the No Cavity Club
 * entrance mural. Never rendered on /special-needs, which keeps a plain register.
 */
export function Mascot({
  pose = "hero",
  className,
}: {
  pose?: MascotPose;
  className?: string;
}) {
  const showCape = pose === "hero";
  const asleep = pose === "sleeping";

  return (
    <svg
      viewBox="0 0 240 280"
      role="img"
      aria-label={poseLabels[pose]}
      className={cn("", className)}
    >
      {/* ---- cape, behind everything, with a pointed hem so it reads as cloth ---- */}
      {showCape && (
        <>
          <path
            d="M94 64
               C48 78, 16 132, 12 206
               L30 232 L44 208 L62 236 L78 210 L94 232
               C92 190, 90 130, 94 64 Z"
            fill="var(--crimson)"
          />
          {/* inner fold — a flat red silhouette reads as a bib, a folded one reads as a cape */}
          <path
            d="M94 64
               C68 78, 50 122, 48 178
               C47 200, 50 218, 56 230
               L62 236 L78 210 L94 232
               C92 190, 90 130, 94 64 Z"
            fill="var(--crimson-btn)"
            opacity="0.5"
          />
        </>
      )}

      {/*
        NOTE: the entrance mural shows this character with a raised fist. At
        this scale a drawn fist reads as a lollipop or a magnifier, so the
        heroic read is carried by the cape, crown and logo shield instead.
        Flagged in DECISIONS.md — the production mascot should be vectorised
        from the mural by an illustrator, fist included.
      */}

      {/* ---- tooth body ---- */}
      <path
        d="M120 48
           C76 48, 48 82, 55 130
           C60 170, 74 198, 80 228
           C84 248, 108 250, 112 226
           C115 208, 125 208, 128 226
           C132 250, 156 248, 160 228
           C166 198, 180 170, 185 130
           C192 82, 164 48, 120 48 Z"
        fill="#ffffff"
        stroke="var(--cyan)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* soft inner shading, gives the tooth volume rather than flat white */}
      <path
        d="M120 56 C88 56, 66 82, 70 124 C74 158, 86 184, 92 212
           C88 176, 78 150, 78 120 C78 84, 96 62, 120 56 Z"
        fill="var(--cyan)"
        opacity="0.13"
      />
      {/* highlight */}
      <ellipse cx="98" cy="86" rx="13" ry="18" fill="#ffffff" opacity="0.9" transform="rotate(-18 98 86)" />

      {/* ---- crown ---- */}
      <path
        d="M84 52 L89 17 L106 40 L120 11 L134 40 L151 17 L156 52
           C145 44, 95 44, 84 52 Z"
        fill="var(--gold)"
        stroke="var(--gold-text)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="120" cy="11" r="4.5" fill="var(--gold-text)" />

      {/* ---- face ---- */}
      {asleep ? (
        <>
          <path
            d="M92 124 q10 -11 20 0"
            stroke="var(--ink)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M130 124 q10 -11 20 0"
            stroke="var(--ink)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M108 156 q12 10 24 0"
            stroke="var(--ink)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <text x="188" y="96" fontSize="26" fontWeight="700" fill="var(--periwinkle)" fontFamily="var(--font-display)">z</text>
          <text x="206" y="70" fontSize="18" fontWeight="700" fill="var(--periwinkle)" fontFamily="var(--font-display)">z</text>
          <text x="219" y="50" fontSize="12" fontWeight="700" fill="var(--periwinkle)" fontFamily="var(--font-display)">z</text>
        </>
      ) : (
        <>
          <circle cx="101" cy="124" r="8" fill="var(--ink)" />
          {pose === "hero" ? (
            <path
              d="M132 126 q9 -11 18 0"
              stroke="var(--ink)"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <circle cx="141" cy="124" r="8" fill="var(--ink)" />
          )}
          {/* eye glints */}
          <circle cx="104" cy="121" r="2.6" fill="#ffffff" />
          {pose !== "hero" && <circle cx="144" cy="121" r="2.6" fill="#ffffff" />}

          <ellipse cx="82" cy="147" rx="11" ry="7" fill="var(--blush)" opacity="0.8" />
          <ellipse cx="160" cy="147" rx="11" ry="7" fill="var(--blush)" opacity="0.8" />

          {pose === "brushing" ? (
            <path
              d="M104 152 q17 20 34 0 q-17 6 -34 0 Z"
              fill="var(--ink)"
            />
          ) : (
            <path
              d="M104 152 q17 17 34 0"
              stroke="var(--ink)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </>
      )}

      {/* ---- cape knot at the neck, so the cape reads as tied on ---- */}
      {showCape && (
        <path
          d="M84 66 C76 62, 70 70, 74 78 C78 86, 90 86, 94 78 C97 71, 92 64, 84 66 Z"
          fill="var(--crimson)"
          stroke="var(--crimson-btn)"
          strokeWidth="2"
        />
      )}

      {/* ---- shield with the logo grid, sat low so the cape stays visible ---- */}
      {pose === "hero" && (
        <>
          <path
            d="M52 146 L85 157 L85 200 C85 225, 69 240, 52 248
               C35 240, 19 225, 19 200 L19 157 Z"
            fill="var(--gold)"
            stroke="var(--gold-text)"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <g>
            <rect x="30" y="170" width="19" height="18" rx="4" fill="var(--coral)" />
            <rect x="54" y="170" width="19" height="18" rx="4" fill="var(--mint)" />
            <rect x="30" y="192" width="19" height="18" rx="4" fill="var(--lime)" />
            <rect x="54" y="192" width="19" height="18" rx="4" fill="var(--lavender)" />
            <path d="M51.5 166 L51.5 214" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M26 190 L77 190" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" />
          </g>
        </>
      )}

      {/* ---- arms down, for the non-heroic poses ---- */}
      {(pose === "calm" || pose === "brushing") && (
        <path
          d="M62 150 C50 164, 48 182, 54 196"
          stroke="var(--cyan)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* ---- toothbrush ---- */}
      {pose === "brushing" && (
        <g transform="rotate(-24 186 140)">
          <rect x="160" y="134" width="54" height="12" rx="6" fill="var(--periwinkle)" />
          <rect x="146" y="130" width="20" height="20" rx="5" fill="var(--mint)" />
          <path
            d="M150 128 v-6 M156 128 v-6 M162 128 v-6"
            stroke="var(--mint)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* ---- sparkles ---- */}
      {(pose === "hero" || pose === "brushing") && (
        <g className="" fill="var(--gold)">
          <path d="M206 148 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 Z" />
          <path d="M34 44 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" opacity="0.8" />
          <path d="M196 190 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z" opacity="0.65" />
        </g>
      )}
    </svg>
  );
}
