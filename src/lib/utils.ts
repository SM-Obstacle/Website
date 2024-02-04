import { IncrementalPayload, TypedDocumentNode } from "@apollo/client";
import { print } from "graphql";

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
  }).then((res) => res.json());

  if (out.errors) {
    throw new Error(out.errors[0].message);
  }

  return out.data!;
}

export function getApiHost() {
  return process.env.RECORDS_API_HOST || "http://localhost:3001";
}

export function getGraphqlApiUrl() {
  return `${getApiHost()}/graphql`;
}
