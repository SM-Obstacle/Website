import { gql } from "@/app/__generated__";
import { ServerProps } from "@/lib/server-props";
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

type SP = ServerProps<{ mxId: string }>;

export default async function Layout({ params, children }: SP & PropsWithChildren) {
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