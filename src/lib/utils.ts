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

/**
 * Base URL of the API as seen from the browser, e.g. `https://example.com/api`.
 *
 * `NEXT_PUBLIC_*` variables are inlined by `next build`, so this one must be set
 * at build time.
 */
export function getPublicApiUrl() {
  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_RECORDS_API_URL || DEFAULT_API_URL,
  );
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
