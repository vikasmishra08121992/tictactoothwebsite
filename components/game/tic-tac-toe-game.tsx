"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Board, type BoardCell } from "@/components/game/board";
import { MarkX, MarkO } from "@/components/game/marks";
import { GridFrame } from "@/components/motifs/grid-frame";
import { Mascot, type MascotPose } from "@/components/mascot/mascot";
import { ButtonLink } from "@/components/ui/button-link";

type Cell = "X" | "O" | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(board: Cell[]): "X" | "O" | "draw" | null {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.every((c) => c !== null) ? "draw" : null;
}

function mascotMove(board: Cell[]): number {
  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);

  // try to win
  for (const i of empty) {
    const copy = [...board];
    copy[i] = "O";
    if (winner(copy) === "O") return i;
  }
  // block player
  for (const i of empty) {
    const copy = [...board];
    copy[i] = "X";
    if (winner(copy) === "X") return i;
  }
  if (board[4] === null) return 4;
  return empty[Math.floor(Math.random() * empty.length)];
}

export function TicTacToeGame() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"player" | "mascot">("player");
  const [result, setResult] = useState<"X" | "O" | "draw" | null>(null);

  useEffect(() => {
    if (turn !== "mascot" || result) return;
    const t = setTimeout(() => {
      setBoard((b) => {
        const i = mascotMove(b);
        const next = [...b];
        next[i] = "O";
        const w = winner(next);
        if (w) setResult(w);
        setTurn("player");
        return next;
      });
    }, 500);
    return () => clearTimeout(t);
  }, [turn, result]);

  const play = (i: number) => {
    if (board[i] || result || turn !== "player") return;
    const next = [...board];
    next[i] = "X";
    const w = winner(next);
    setBoard(next);
    if (w) {
      setResult(w);
    } else {
      setTurn("mascot");
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn("player");
    setResult(null);
  };

  const cells: BoardCell[] = board.map((c, i) => ({
    label: c ? `Cell ${i + 1}: ${c === "X" ? "you" : "mascot"}` : `Cell ${i + 1}: empty`,
    disabled: !!c || !!result || turn !== "player",
    content: c === "X" ? <MarkX /> : c === "O" ? <MarkO /> : null,
  }));

  const pose: MascotPose =
    result === "O" ? "hero" : result === "draw" ? "sleeping" : result === "X" ? "calm" : "calm";

  const statusText = !result
    ? turn === "player"
      ? "Your move — pick a square."
      : "The mascot is thinking…"
    : result === "draw"
      ? "A tie game! Well played."
      : result === "X"
        ? "You win! Great game."
        : "The mascot wins this round.";

  return (
    <div className="mx-auto grid max-w-3xl items-center gap-8 sm:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center gap-3">
        <Mascot pose={pose} className="h-32 w-auto" />
        <p aria-live="polite" className="max-w-[14rem] text-center text-sm font-semibold text-ink">
          {statusText}
        </p>
      </div>
      <div className="relative mx-auto w-full max-w-xs">
        <GridFrame variant="full" className="pointer-events-none absolute inset-0 h-full w-full" />
        <Board
          cells={cells}
          ariaLabel="Tic-tac-toe against the mascot"
          onActivate={play}
          cellClassName="rounded-xl enabled:hover:bg-ink/5"
        />
      </div>
      <div className="col-span-full flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Play again
        </button>
        <ButtonLink href="/">Back to Home</ButtonLink>
      </div>
    </div>
  );
}
