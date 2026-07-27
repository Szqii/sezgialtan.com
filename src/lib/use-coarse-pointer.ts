import { useSyncExternalStore } from "react";

/**
 * True when the primary pointer is a finger rather than a mouse.
 *
 * `pointer: coarse`, not a width breakpoint. What matters here is whether
 * touching the input summons a software keyboard over half the screen — a phone
 * held in landscape is wider than `sm` and still does, and a narrow desktop
 * window is not a phone. Same reasoning as the font size on the composer.
 *
 * The server snapshot is `false`, so prerendered HTML ships the mouse layout and
 * touch devices settle into theirs on hydration. Getting it the wrong way round
 * would mean every desktop visitor loading a phone layout first.
 */
const QUERY = "(pointer: coarse)";

let mediaQuery: MediaQueryList | null = null;

function get(): MediaQueryList {
  mediaQuery ??= window.matchMedia(QUERY);
  return mediaQuery;
}

export function useCoarsePointer(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = get();
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => get().matches,
    () => false,
  );
}
