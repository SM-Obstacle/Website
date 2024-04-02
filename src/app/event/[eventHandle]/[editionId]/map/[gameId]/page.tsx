import { gql } from "@/app/__generated__";
import { SortState } from "@/app/__generated__/graphql";
import * as MapPage from "@/app/map/[gameId]/page";
import { ServerProps } from "@/lib/server-props";
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
    rawEditionId: string,
    gameId: string,
    dateSortBy?: SortState,
    rankSortBy?: SortState
  ) => {
    const editionId = parseInt(rawEditionId);
    return fetchGraphql(GET_EVENT_MAP_INFO, {
      eventHandle,
      editionId,
      gameId,
      dateSortBy,
      rankSortBy,
    });
  }
);

export default function EventMapRecords(
  sp: ServerProps<
    MapPage.SP["params"] & { eventHandle: string; editionId: string },
    MapPage.SP["searchParams"]
  >
) {
  return MapPage._MapRecords({
    ...sp,
    fetchMapInfo: async (
      gameId: string,
      dateSortBy?: SortState,
      rankSortBy?: SortState
    ) =>
      (
        await fetchMapInfo(
          sp.params.eventHandle,
          sp.params.editionId,
          gameId,
          dateSortBy,
          rankSortBy
        )
      ).event.edition!,
  } as any);
}
