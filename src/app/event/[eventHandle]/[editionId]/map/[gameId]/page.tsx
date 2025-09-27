import { cache } from "react";
import { gql } from "@/app/__generated__";
import type { SortState } from "@/app/__generated__/graphql";
import { query } from "@/app/ApolloClient";
import * as MapRecordsContent from "@/app/map/[gameId]/MapRecordsContent";
import * as MapPage from "@/app/map/[gameId]/page";
import Link from "@/components/Link";
import MPFormat from "@/components/MPFormat";
import {
  ToolbarTitle as RawToolbarTitle,
  ToolbarTitleWrapper,
} from "@/components/ToolbarWrapper";
import {
  type MapContent,
  MedalRecord,
  RankedRecordLine,
  type RecordLine,
} from "@/lib/map-page-types";
import { Medal } from "@/lib/ranked-record";
import { getSortState, type ServerProps } from "@/lib/server-props";

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
          map {
            gameId
            name
            cpsNumber
            player {
              login
              name
            }
          }
          linkToOriginal
          originalMap {
            gameId
          }
          medalTimes {
            bronzeTime
            silverTime
            goldTime
            championTime
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
    rankSortBy?: SortState,
  ) => {
    return query({
      query: GET_EVENT_MAP_INFO,
      variables: {
        eventHandle,
        editionId,
        gameId,
        dateSortBy,
        rankSortBy,
      },
      errorPolicy: "all",
    });
  },
);

function ToolbarTitle({
  mapName,
  mapUid,
  eventHandle,
  editionId,
  eventName,
}: {
  mapName: string;
  mapUid?: string;
  eventHandle: string;
  editionId: number;
  eventName: string;
}) {
  return (
    <ToolbarTitleWrapper>
      <RawToolbarTitle>
        <MPFormat>{mapName}</MPFormat>
      </RawToolbarTitle>
      {
        <span>
          on{" "}
          <Link explicit href={`/event/${eventHandle}/${editionId}`}>
            {eventName}
          </Link>{" "}
          {mapUid && (
            <>
              (see{" "}
              <Link explicit href={`/map/${mapUid}`}>
                original
              </Link>
              )
            </>
          )}{" "}
        </span>
      }
    </ToolbarTitleWrapper>
  );
}

export default async function EventMapRecords(
  sp: ServerProps<
    Awaited<MapPage.SP["params"]> & { eventHandle: string; editionId: string },
    Awaited<MapPage.SP["searchParams"]>
  >,
) {
  const params = await sp.params;
  const searchParams = await sp.searchParams;

  const editionId = parseInt(params.editionId, 10);
  const dataRaw = await fetchMapInfo(
    params.eventHandle,
    editionId,
    params.gameId,
    searchParams.dateSortBy ? getSortState(searchParams.dateSortBy) : undefined,
    searchParams.rankSortBy ? getSortState(searchParams.rankSortBy) : undefined,
  );
  // : )
  const data = {
    ...dataRaw,
    event: {
      ...dataRaw.data?.event,
      edition: {
        ...dataRaw.data?.event.edition,
        map: {
          ...dataRaw.data?.event.edition?.map.map,
          medalTimes: dataRaw.data?.event.edition?.map.medalTimes,
          records: dataRaw.data?.event.edition?.map.records,
        },
      },
    },
  };

  const eventName =
    data.event.edition?.name +
    (data.event.edition?.subtitle ? ` ${data.event.edition?.subtitle}` : "");

  const records = (data.data?.event.edition?.map.records ?? []).map(
    (record) =>
      new RankedRecordLine(
        record.id,
        record.rank,
        record.player,
        record.time,
        record.recordDate,
      ) as RecordLine,
  );

  if (data.event.edition.map.medalTimes) {
    records.push(
      new MedalRecord(
        data.event.edition.map.medalTimes.bronzeTime,
        Medal.Bronze,
      ),
      new MedalRecord(
        data.event.edition.map.medalTimes.silverTime,
        Medal.Silver,
      ),
      new MedalRecord(data.event.edition.map.medalTimes.goldTime, Medal.Gold),
      new MedalRecord(
        data.event.edition.map.medalTimes.championTime,
        Medal.Champion,
      ),
    );
    records.sort(
      (a, b) => a.time - b.time || -(a.sortPriority - b.sortPriority),
    );
  }

  const content = {
    map: {
      gameId: data.data?.event.edition?.map.map.gameId ?? "",
      player: data.data?.event.edition?.map.map.player ?? {
        login: "",
        name: "",
      },
      cpsNumber: data.event.edition.map.cpsNumber ?? undefined,
      records: records,
    },
  } satisfies MapContent;

  return data.error ? (
    data.error.message
  ) : (
    <MapRecordsContent.MapRecordsContent
      data={content}
      toolbarTitle={
        <ToolbarTitle
          mapName={data.data?.event.edition?.map.map.name ?? ""}
          mapUid={
            dataRaw.data?.event.edition?.map.originalMap?.gameId ||
            (dataRaw.data?.event.edition?.map.linkToOriginal &&
              data.event.edition.map.gameId) ||
            undefined
          }
          eventHandle={params.eventHandle}
          editionId={editionId}
          eventName={eventName}
        />
      }
    />
  );
}
