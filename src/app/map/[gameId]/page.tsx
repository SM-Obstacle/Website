import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import LoadErrorPanel from "@/components/layout/LoadErrorPanel";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import MapPage from "@/components/map/MapPage";
import catchGqlError from "@/lib/catchError";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";

const GET_MAP_INFO = gql(/* GraphQL */ `
  query GetMap($gameId: String!) {
    map(gameId: $gameId) {
      ...MapInfo
    }
  }
`);

const fetchMap = cache(async (gameId: string) =>
  query({ query: GET_MAP_INFO, variables: { gameId } }).catch(catchGqlError),
);

export async function generateMetadata(
  props: PageProps<"/map/[gameId]">,
): Promise<Metadata> {
  const { gameId } = await props.params;
  const { data } = await fetchMap(gameId);

  return { title: data ? toPlainText(parse(data.map.name)) : gameId };
}

export default async function MapRecordsPage(
  props: PageProps<"/map/[gameId]">,
) {
  const { gameId } = await props.params;

  const { data, error } = await fetchMap(gameId);

  if (error || !data) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Maps</PageTitle>]}
        selectedMenu="maps"
      >
        <LoadErrorPanel title="Invalid map">
          Could not load this map: {error?.message ?? "unknown error"}
        </LoadErrorPanel>
      </PageShell>
    );
  }

  // A map that only exists inside an event has no records of its own, so it
  // belongs on the event's own map page.
  const [related] = data.map.relatedEventEditions;
  if (data.map.relatedEventEditions.length === 1 && related.redirectToEvent) {
    redirect(
      `/event/${related.edition.event.handle}/${related.edition.id}/map/${gameId}`,
    );
  }

  return <MapPage map={data.map} />;
}
