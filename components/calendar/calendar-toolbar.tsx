"use client";

import { ChevronLeft, ChevronRight, Plus, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VIEWS,
  STATUS_FILTERS,
  type CalendarView,
  type StatusFilter,
} from "@/lib/scheduling/view";
import { cn } from "@/lib/utils";

/** What one press of the arrows moves by, phrased for a screen reader. */
const PERIOD: Record<CalendarView, string> = {
  day: "day",
  week: "week",
  month: "month",
  agenda: "fortnight",
};

/**
 * The calendar's controls.
 *
 * Every control writes to the URL rather than to local state. That is what
 * makes the range the server fetched and the range the grid draws the same
 * thing — they used to be able to disagree, and the calendar would show an
 * empty week with no indication anything was wrong.
 */
export function CalendarToolbar({
  view,
  status,
  label,
  pendingCount,
  live,
  canManage,
  onView,
  onStatus,
  onShift,
  onToday,
  onCreate,
}: {
  view: CalendarView;
  status: StatusFilter;
  label: string;
  pendingCount: number;
  live: boolean;
  canManage: boolean;
  onView: (v: CalendarView) => void;
  onStatus: (s: StatusFilter) => void;
  onShift: (delta: number) => void;
  onToday: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-portal-line bg-white">
      <div className="mx-auto flex max-w-[86rem] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 md:px-8">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label={`Previous ${PERIOD[view]}`}
            onClick={() => onShift(-1)}
            className="size-11 rounded-full"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={`Next ${PERIOD[view]}`}
            onClick={() => onShift(1)}
            className="size-11 rounded-full"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            onClick={onToday}
            className="ml-1 h-11 rounded-full px-4"
          >
            Today
          </Button>
        </div>

        {/*
          The page's h1. The calendar has no separate title bar — the range IS
          the title, and inventing a second heading above it would push the
          grid down for the sake of a word. It is polite-live because the
          arrows change it without a navigation a screen reader would announce.
        */}
        <h1
          aria-live="polite"
          className="font-display text-lg font-bold text-ink"
        >
          <span className="sr-only">Appointment calendar — </span>
          {label}
        </h1>

        {pendingCount > 0 && (
          <span className="rounded-full border-2 border-dashed border-gold bg-gold/25 px-3 py-1 text-xs font-bold text-ink">
            {pendingCount} awaiting confirmation
          </span>
        )}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span
            className="flex items-center gap-1.5 text-xs font-semibold text-ink/85"
            aria-live="polite"
          >
            {live ? (
              <Wifi className="size-4 text-leaf-text" aria-hidden="true" />
            ) : (
              <WifiOff className="size-4 text-crimson-text" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {live ? "Live" : "Reconnecting…"}
            </span>
          </span>

          {/* `items` maps value → label. Without it Base UI's Select.Value
              renders the raw value, so the filter read "all" and "no_show"
              rather than "Everything" and "No-shows". */}
          <Select
            value={status}
            onValueChange={(v) => onStatus(v as StatusFilter)}
            items={Object.fromEntries(STATUS_FILTERS.map((s) => [s.id, s.label]))}
          >
            <SelectTrigger
              aria-label="Filter by status"
              className="w-auto min-w-40 rounded-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* A radio group, not tabs: it selects one of several views of the
              same data rather than navigating anywhere. */}
          <div
            role="radiogroup"
            aria-label="Calendar view"
            className="flex rounded-full border-2 border-ink/15 p-0.5"
          >
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                role="radio"
                // The visible label is a pair of responsive spans, so the
                // accessible name would otherwise depend on the viewport.
                aria-label={`${v.label} view`}
                aria-checked={view === v.id}
                onClick={() => onView(v.id)}
                className={cn(
                  "min-h-11 rounded-full px-3.5 text-sm font-semibold transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  view === v.id ? "bg-ink text-cream" : "text-ink hover:bg-ink/8"
                )}
              >
                <span className="hidden sm:inline">{v.label}</span>
                <span className="sm:hidden">{v.short}</span>
              </button>
            ))}
          </div>

          {canManage && (
            <Button onClick={onCreate} className="h-11 rounded-full px-5">
              <Plus className="size-5" aria-hidden="true" />
              <span className="hidden sm:inline">New appointment</span>
              <span className="sm:hidden">New</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
