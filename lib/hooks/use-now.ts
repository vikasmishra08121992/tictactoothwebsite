"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A clock the render can read.
 *
 * Calling `Date.now()` during render is impure: the value changes between
 * renders for reasons React does not know about, so anything derived from it
 * updates only when the component happens to re-render for some other reason.
 * That is exactly wrong for a pending appointment's expiry countdown — it
 * would sit at "expires in 6 hours" until reception clicked something
 * unrelated.
 *
 * The clock is an external mutable source, which is precisely what
 * `useSyncExternalStore` is for — an effect that seeds state and then ticks it
 * is the same thing with an extra render and a cascade warning.
 *
 * Two details carry weight:
 *
 *  - The snapshot is quantised to the interval. `getSnapshot` must return a
 *    stable value between ticks; returning a raw `Date.now()` would differ on
 *    every call and React would re-render forever.
 *  - The server snapshot is `null`. The server and the browser run this minutes
 *    apart, so a real timestamp there would be a hydration mismatch. Callers
 *    treat `null` as "not known yet" and simply omit anything time-dependent.
 */
export function useNow(intervalMs = 60_000): number | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const id = setInterval(onChange, intervalMs);
      return () => clearInterval(id);
    },
    [intervalMs]
  );

  const getSnapshot = useCallback(
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    [intervalMs]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
