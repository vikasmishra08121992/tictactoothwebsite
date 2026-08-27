"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BoardCell = {
  content: ReactNode;
  label: string;
  disabled?: boolean;
};

/**
 * A keyboard-operable 3×3 grid — the shared interaction engine behind the
 * treatments board and the 404 game (mechanism C). Arrow keys move focus,
 * Enter/Space activates.
 *
 * The cells are wrapped in explicit `role="row"` groups: an ARIA `grid` must
 * contain rows, and a `gridcell` must have a row parent. Without them axe
 * flags both aria-required-children and aria-required-parent as critical.
 */
export function Board({
  cells,
  onActivate,
  onFocusChange,
  className,
  cellClassName,
  ariaLabel,
}: {
  cells: BoardCell[];
  onActivate: (index: number) => void;
  onFocusChange?: (index: number) => void;
  className?: string;
  cellClassName?: string;
  ariaLabel: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusCell = (index: number) => {
    const clamped = (index + 9) % 9;
    refs.current[clamped]?.focus();
    onFocusChange?.(clamped);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusCell(index + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusCell(index - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        focusCell(index + 3);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusCell(index - 3);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!cells[index].disabled) onActivate(index);
        break;
    }
  };

  const rows = [0, 1, 2];

  return (
    <div
      role="grid"
      aria-label={ariaLabel}
      className={cn("relative grid grid-rows-3", className)}
    >
      {rows.map((row) => (
        <div key={row} role="row" className="grid grid-cols-3">
          {cells.slice(row * 3, row * 3 + 3).map((cell, col) => {
            const i = row * 3 + col;
            return (
              <button
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="gridcell"
                aria-label={cell.label}
                disabled={cell.disabled}
                tabIndex={i === 0 ? 0 : -1}
                onFocus={() => onFocusChange?.(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onClick={() => !cell.disabled && onActivate(i)}
                onMouseEnter={() => onFocusChange?.(i)}
                className={cn(
                  "relative flex aspect-square items-center justify-center text-2xl font-bold text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring disabled:cursor-default",
                  cellClassName
                )}
              >
                {cell.content}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
