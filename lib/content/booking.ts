/**
 * Booking form content.
 *
 * `concernOptions` and `timeSlots` used to live here. They are gone
 * deliberately: reasons for visiting are now `treatment_types` rows (a
 * receptionist can add one without a deploy) and times come from
 * `get_available_slots`, which knows about opening hours, closures, lead time
 * and what is already booked. A hardcoded list of either would drift out of
 * agreement with the diary and offer parents slots that do not exist.
 *
 * Relationship stays here: it is a fixed vocabulary used for consent records,
 * not clinic configuration, and changing it has legal implications rather than
 * operational ones.
 */
export const relationshipOptions = [
  "Mother",
  "Father",
  "Legal guardian",
  "Other family member",
] as const;
