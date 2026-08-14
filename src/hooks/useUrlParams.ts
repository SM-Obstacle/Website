"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type ParamUpdates = Record<string, string | number | undefined | null>;

/**
 * Reads and writes the query string without going back to the server.
 *
 * Every list on the site fetches its rows from the client, so filtering,
 * sorting and paging only need the URL to change: `useSearchParams` re-renders
 * the components that read it, which re-runs their Apollo queries. Using the
 * History API instead of `router.push` keeps Next from refetching the RSC
 * payload of a page whose server part doesn't depend on these params.
 */
export function useUrlParams() {
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (
      updates: ParamUpdates,
      { remove = [], replace = false }: { remove?: readonly string[]; replace?: boolean } = {},
    ) => {
      const params = new URLSearchParams(window.location.search);

      for (const key of remove) {
        params.delete(key);
      }

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      const query = params.toString();
      const url = `${window.location.pathname}${query ? `?${query}` : ""}`;

      if (replace) {
        window.history.replaceState(null, "", url);
      } else {
        window.history.pushState(null, "", url);
      }
    },
    [],
  );

  return { searchParams, setParams };
}
