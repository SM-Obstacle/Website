import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";

const GET_EVENT_EDITION_FROM_MX_ID = gql(/* GraphQL */ `
  query GetEventEditionFromMxId($mxId: Int!) {
    eventEditionFromMxId(mxId: $mxId) {
      id
      event {
        handle
      }
    }
  }
`);

export default async function Layout({
  params,
  children,
}: { params: Promise<{ mxId: string }> } & PropsWithChildren) {
  const mxId = parseInt((await params).mxId, 10);

  const eventEdition = await query({
    query: GET_EVENT_EDITION_FROM_MX_ID,
    variables: { mxId },
    errorPolicy: "all",
  });

  if (eventEdition.data?.eventEditionFromMxId) {
    const handle = eventEdition.data.eventEditionFromMxId.event.handle;
    const edition = eventEdition.data.eventEditionFromMxId.id;
    return redirect(`/event/${handle}/${edition}`);
  }

  return <>{children}</>;
}
