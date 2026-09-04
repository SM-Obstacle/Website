import type { Metadata } from "next";
import { cache } from "react";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import LoadErrorPanel from "@/components/layout/LoadErrorPanel";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import MapPage from "@/components/map/MapPage";
import catchGqlError from "@/lib/catchError";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";

const GET_EVENT_MAP_INFO = gql(/* GraphQL */ `
  query GetEventMapInfo(
    $eventHandle: String!
    $editionId: Int!
    $gameId: String!
  ) {
    event(handle: $eventHandle) {
      edition(editionId: $editionId) {
        name
        subtitle
        map(gameId: $gameId) {
          map {
            ...MapInfo
          }
          linkToOriginal
          originalMap {
            gameId
          }
        }
      }
    }
  }
`);

const fetchMap = cache(
  async (eventHandle: string, editionId: number, gameId: string) =>
    query({
      query: GET_EVENT_MAP_INFO,
      variables: { eventHandle, editionId, gameId },
    }).catch(catchGqlError),
);

export async function generateMetadata(
  props: PageProps<"/event/[eventHandle]/[editionId]/map/[gameId]">,
): Promise<Metadata> {
  const { eventHandle, editionId, gameId } = await props.params;
  const { data } = await fetchMap(
    eventHandle,
    Number.parseInt(editionId, 10),
    gameId,
  );

  const name = data?.event.edition?.map.map.name;
  return { title: name ? toPlainText(parse(name)) : gameId };
}

export default async function EventMapPage(
  props: PageProps<"/event/[eventHandle]/[editionId]/map/[gameId]">,
) {
  const params = await props.params;
  const eventHandle = params.eventHandle;
  const editionId = Number.parseInt(params.editionId, 10);
  const gameId = params.gameId;

  const { data, error } = await fetchMap(eventHandle, editionId, gameId);
  const edition = data?.event.edition;
  const eventMap = edition?.map;

  if (error || !eventMap) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Events</PageTitle>]}
        selectedMenu="events"
      >
        <LoadErrorPanel title="Invalid event map">
          <p>Could not load this map: {error?.message ?? "unknown map"}</p>
        </LoadErrorPanel>
      </PageShell>
    );
  }

  return (
    <MapPage
      map={eventMap.map}
      event={{
        handle: eventHandle,
        editionId,
        name: edition.name + (edition.subtitle ? ` ${edition.subtitle}` : ""),
        // An edition either copies a map under a name of its own, or runs the
        // original one as it is.
        originalGameId:
          eventMap.originalMap?.gameId ??
          (eventMap.linkToOriginal ? eventMap.map.gameId : undefined),
      }}
    />
  );
}
