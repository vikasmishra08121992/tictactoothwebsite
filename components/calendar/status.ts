import type { AppointmentStatus } from "@/lib/supabase/types";

/**
 * One definition of what each status looks like.
 *
 * Status is never signalled by colour alone. Every appointment carries a
 * border treatment and a text label as well as a hue, because a receptionist
 * must be able to tell a held request from a confirmed booking at a glance and
 * colour blindness is common enough that hue on its own would fail some of
 * them. The dashed border on `pending` is the load-bearing signal; the gold is
 * the reinforcement.
 */

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Attended",
  cancelled: "Cancelled",
  no_show: "No-show",
};

/** Block styling on the time grid. */
export const STATUS_BLOCK: Record<AppointmentStatus, string> = {
  pending: "border-2 border-dashed border-gold bg-gold/25 text-ink",
  confirmed: "border-2 border-teal-text bg-mint/50 text-ink",
  completed: "border-2 border-ink/25 bg-ink/8 text-ink/85",
  cancelled: "border-2 border-ink/25 bg-ink/8 text-ink/85 line-through",
  no_show: "border-2 border-crimson-text bg-crimson/15 text-ink",
};

/** Small pill, used in drawers and lists. */
export const STATUS_PILL: Record<AppointmentStatus, string> = {
  pending: "border-2 border-dashed border-gold bg-gold/25 text-ink",
  confirmed: "bg-mint text-teal-text",
  completed: "bg-ink/10 text-ink",
  cancelled: "bg-crimson/15 text-crimson-text",
  no_show: "bg-crimson-btn text-white",
};

/** Dense marker for the month grid, where there is no room for a label. */
export const STATUS_DOT: Record<AppointmentStatus, string> = {
  pending: "bg-gold",
  confirmed: "bg-teal-text",
  completed: "bg-ink/40",
  cancelled: "bg-ink/20",
  no_show: "bg-crimson-btn",
};
