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

export function getApiHost() {
  return process.env.RECORDS_API_HOST || "127.0.0.1:3001";
}

export function getGraphqlApiUrl() {
  return `http://${getApiHost()}/graphql`;
}

export function getGraphqlApiWsUrl() {
  return `ws://${getApiHost()}/graphql/subscriptions`;
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
