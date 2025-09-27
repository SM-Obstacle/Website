import { Medal } from "./ranked-record";

export function getApiHost() {
  return process.env.RECORDS_API_HOST || "http://127.0.0.1:3001";
}

export function getGraphqlApiUrl() {
  return `${getApiHost()}/graphql`;
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

export type DiscriminatedUnion<K extends PropertyKey, T extends object> = {
  [P in keyof T]: { [Q in K]: P } & T[P] extends infer U
    ? { [Q in keyof U]: U[Q] }
    : never;
}[keyof T];
