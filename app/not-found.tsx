import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { SiteChrome } from "@/components/layout/site-chrome";
import { TicTacToeGame } from "@/components/game/tic-tac-toe-game";
import { Sticker } from "@/components/ui/sticker";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <SiteChrome>
    <Section tone="wash" size="loose" grain className="min-h-[70vh]">
      <div className="mx-auto max-w-2xl text-center">
        <Sticker tone="coral" tilt="right">
          Error 404
        </Sticker>
        <h1 className="mt-6 text-4xl font-bold text-ink md:text-6xl">
          This page wandered off.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/85 md:text-xl">
          The page you were after doesn&apos;t exist — but you have landed on
          our favourite board, so you may as well play a round while you decide
          where to go next.
        </p>
      </div>
      <div className="mt-14">
        <TicTacToeGame />
      </div>
    </Section>
    </SiteChrome>
  );
}
