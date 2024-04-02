import { gql } from "@/app/__generated__";
import { fetchGraphql } from "@/lib/utils";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

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

export default async function Layout({ params, children }: { params: { mxId: string } } & PropsWithChildren) {
  const mxId = parseInt(params.mxId);

  const eventEdition = await fetchGraphql(GET_EVENT_EDITION_FROM_MX_ID, {
    mxId,
  });

  if (eventEdition.eventEditionFromMxId) {
    const handle = eventEdition.eventEditionFromMxId.event.handle;
    const edition = eventEdition.eventEditionFromMxId.id;
    return redirect(`/event/${handle}/${edition}`);
  }

  return (
    <>{children}</>
  );
}