import { IncrementalPayload, TypedDocumentNode } from "@apollo/client";
import { print } from "graphql";
import { Medal } from "./ranked-record";

// TODO: throw on error
export async function fetchGraphql<O, P = { [key: string]: any }>(
  query: TypedDocumentNode<O, P>,
  variables?: P
) {
  const out: IncrementalPayload<O, unknown> = await fetch(getGraphqlApiUrl(), {
    method: "post",
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  }).then((res) => res.json());

  if (out.errors) {
    console.error(out.errors);
    throw new Error(out.errors[0].message);
  }

  return out.data!;
}

export function getApiHost() {
  return process.env.RECORDS_API_HOST || "http://192.168.31.228:3001";
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
  const numA = a && numericMedal[a] || 0;
  const numB = b && numericMedal[b] || 0;
  return numA - numB;
}

export type DiscriminatedUnion<K extends PropertyKey, T extends object> = {
  [P in keyof T]: ({ [Q in K]: P } & T[P]) extends infer U ? { [Q in keyof U]: U[Q] } : never
}[keyof T];