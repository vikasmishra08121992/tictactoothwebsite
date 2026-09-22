import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { SiteChrome } from "@/components/layout/site-chrome";
import { TicTacToeGame } from "@/components/game/tic-tac-toe-game";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <SiteChrome>
    <Section tone="wash" size="loose" grain className="min-h-[70vh]">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-base font-semibold text-teal-text">Error 404</p>
        <h1 className="mt-3 text-4xl font-bold text-ink md:text-6xl">
          That page does not exist.
        </h1>
        <p className="mt-5 text-xl text-ink/85">
          Try the menu above, or play a round while you decide where to go.
        </p>
      </div>
      <div className="mt-14">
        <TicTacToeGame />
      </div>
    </Section>
    </SiteChrome>
  );
}
