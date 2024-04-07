import { gql } from "@/app/__generated__";
import { GetEventMapInfoQuery, GetMapInfoQuery, SortState } from "@/app/__generated__/graphql";
import * as MapPage from "@/app/map/[gameId]/page";
import Link from "@/components/Link";
import MPFormat from "@/components/MPFormat";
import { ToolbarTitleWrapper, ToolbarTitle as RawToolbarTitle } from "@/components/ToolbarWrapper";
import { ServerProps, getSortState } from "@/lib/server-props";
import { fetchGraphql } from "@/lib/utils";
import { cache } from "react";

export const generateMetadata = MapPage.generateMetadata;

const GET_EVENT_MAP_INFO = gql(/* GraphQL */ `
  query GetEventMapInfo(
    $eventHandle: String!
    $editionId: Int!
    $gameId: String!
    $dateSortBy: SortState
    $rankSortBy: SortState
  ) {
    event(handle: $eventHandle) {
      edition(editionId: $editionId) {
        name
        subtitle
        map(gameId: $gameId) {
          gameId
          name
          cpsNumber
          reversed
          player {
            login
            name
          }
          records(rankSortBy: $rankSortBy, dateSortBy: $dateSortBy) {
            player {
              login
              name
            }
            ...RecordBase
          }
        }
      }
    }
  }
`);

const fetchMapInfo = cache(
  async (
    eventHandle: string,
    editionId: number,
    gameId: string,
    dateSortBy?: SortState,
    rankSortBy?: SortState
  ) => {
    return fetchGraphql(GET_EVENT_MAP_INFO, {
      eventHandle,
      editionId,
      gameId,
      dateSortBy,
      rankSortBy,
    });
  }
);

function ToolbarTitle({
  mapName,
  mapUid,
  eventHandle,
  editionId,
  eventName,
}: {
  mapName: string,
  mapUid: string,
  eventHandle: string,
  editionId: number,
  eventName: string,
}) {
  // FIXME: this should be removed when we correctly fill the maps of benchmark 2
  // with this, it's not possible to go back to this page from the original map
  const originalUid = mapUid.endsWith('_benchmark') ? mapUid.substring(0, mapUid.length - '_benchmark'.length) : mapUid;

  return (
    <ToolbarTitleWrapper>
      <RawToolbarTitle><MPFormat>{mapName}</MPFormat></RawToolbarTitle>
      {<span>on <Link explicit href={`/event/${eventHandle}/${editionId}`}>
        {eventName}
      </Link> (see <Link explicit href={`/map/${originalUid}`}>original</Link>)</span>}
    </ToolbarTitleWrapper>
  );
}

export default async function EventMapRecords(
  sp: ServerProps<
    MapPage.SP["params"] & { eventHandle: string; editionId: string },
    MapPage.SP["searchParams"]
  >
) {
  const editionId = parseInt(sp.params.editionId);
  const data = (await fetchMapInfo(sp.params.eventHandle,
    editionId,
    sp.params.gameId,
    getSortState(sp.searchParams.dateSortBy),
    getSortState(sp.searchParams.rankSortBy),
  ));

  const eventName = data.event.edition?.name
    + (data.event.edition?.subtitle ? " " + data.event.edition?.subtitle : '');

  return (
    <MapPage.MapRecordsContent
      data={data.event.edition!}
      toolbarTitle={(
        <ToolbarTitle
          mapName={data.event.edition?.map.name}
          mapUid={data.event.edition?.map.gameId}
          eventHandle={sp.params.eventHandle}
          editionId={editionId}
          eventName={eventName}
        />
      )}
    />
  );
}
