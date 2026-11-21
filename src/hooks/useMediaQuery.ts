"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query, for the cases CSS can't express — picking a
 * different component rather than restyling the same one.
 *
 * The server has no viewport to measure, so it always renders the `false`
 * branch and the client corrects it on hydration. Anything that must be right
 * in the very first paint belongs in a Tailwind breakpoint instead.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
