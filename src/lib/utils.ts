import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { Medal } from "./ranked-record";

/**
 * Teaches tailwind-merge about the theme scales we added in `globals.css`.
 * Without this it doesn't recognise e.g. `rounded-block` as a radius, so it
 * leaves shadcn's own `rounded-xl` in place and the two fight in the cascade.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["bar", "block", "panel", "inset"],
      spacing: ["inset", "logo"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_API_URL = "http://127.0.0.1:3001";

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

/** Public runtime configuration, served by `/env.js` as `window.__ENV__`. */
export type PublicEnv = {
  RECORDS_API_URL: string;
};

declare global {
  interface Window {
    __ENV__?: PublicEnv;
  }
}

/**
 * Base URL of the API as seen from the browser, e.g. `https://example.com/api`.
 *
 * It comes from `PUBLIC_RECORDS_API_URL`, read at runtime (it is deliberately not
 * a `NEXT_PUBLIC_*` variable, which `next build` would inline). On the server it's
 * read from the environment; in the browser, from `window.__ENV__`, which
 * `/env.js` sets before hydration.
 */
export function getPublicApiUrl() {
  const url =
    typeof window === "undefined"
      ? process.env.PUBLIC_RECORDS_API_URL
      : window.__ENV__?.RECORDS_API_URL;
  return trimTrailingSlash(url || DEFAULT_API_URL);
}

/**
 * Base URL of the API, depending on where the code runs.
 *
 * On the Next.js server, `RECORDS_API_URL` is used (read at runtime), so SSR can
 * reach the API through an internal address. It falls back to the public URL.
 */
export function getApiUrl() {
  if (typeof window === "undefined") {
    const serverUrl = process.env.RECORDS_API_URL;
    if (serverUrl) return trimTrailingSlash(serverUrl);
  }
  return getPublicApiUrl();
}

export function getGraphqlApiUrl() {
  return `${getApiUrl()}/graphql`;
}

/** Subscriptions only run in the browser, so this always uses the public URL. */
export function getGraphqlApiWsUrl() {
  return `${getPublicApiUrl().replace(/^http/, "ws")}/graphql/subscriptions`;
}

type NumericMedal = {
  [K in Medal]: number;
};

const numericMedal: NumericMedal = {
  [Medal.Bronze]: 1,
  [Medal.Silver]: 2,
  [Medal.Gold]: 3,
  [Medal.Champion]: 4,
};

export function cmpMedals(a: Medal | null, b: Medal | null) {
  const numA = (a && numericMedal[a]) || 0;
  const numB = (b && numericMedal[b]) || 0;
  return numA - numB;
}
