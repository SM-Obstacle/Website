import { gql } from "@/app/__generated__";
import { SortState } from "@/app/__generated__/graphql";
import * as MapPage from "@/app/map/[gameId]/page";
import * as MapRecordsContent from "@/app/map/[gameId]/MapRecordsContent";
import Link from "@/components/Link";
import MPFormat from "@/components/MPFormat";
import { ToolbarTitleWrapper, ToolbarTitle as RawToolbarTitle } from "@/components/ToolbarWrapper";
import { ServerProps, getSortState } from "@/lib/server-props";
import { fetchGraphql } from "@/lib/utils";
import { cache } from "react";
import { MapContent, MedalRecord, RankedRecordLine, RecordLine } from "@/lib/map-page-types";
import { Medal } from "@/lib/ranked-record";

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
  mapUid?: string,
  eventHandle: string,
  editionId: number,
  eventName: string,
}) {
  return (
    <ToolbarTitleWrapper>
      <RawToolbarTitle><MPFormat>{mapName}</MPFormat></RawToolbarTitle>
      {<span>on <Link explicit href={`/event/${eventHandle}/${editionId}`}>
        {eventName}
      </Link> {mapUid && (
        <>
          (see <Link explicit href={`/map/${mapUid}`}>original</Link>)
        </>
      )} </span>}
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
  const dataRaw = await fetchMapInfo(sp.params.eventHandle,
    editionId,
    sp.params.gameId,
    getSortState(sp.searchParams.dateSortBy),
    getSortState(sp.searchParams.rankSortBy),
  );
  // : )
  const data = {
    ...dataRaw,
    event: {
      ...dataRaw.event,
      edition: {
        ...dataRaw.event.edition,
        map: {
          ...dataRaw.event.edition!.map.map,
          medalTimes: dataRaw.event.edition!.map.medalTimes,
          records: dataRaw.event.edition!.map.records,
        }
      }
    },
  };

  const eventName = data.event.edition?.name
    + (data.event.edition?.subtitle ? " " + data.event.edition?.subtitle : '');

  let records = data.event.edition.map.records.map((record) => new RankedRecordLine(record.id, record.rank, record.player, record.time, record.recordDate) as RecordLine);

  if (data.event.edition.map.medalTimes) {
    records.push(
      new MedalRecord(data.event.edition.map.medalTimes.bronzeTime, Medal.Bronze),
      new MedalRecord(data.event.edition.map.medalTimes.silverTime, Medal.Silver),
      new MedalRecord(data.event.edition.map.medalTimes.goldTime, Medal.Gold),
      new MedalRecord(data.event.edition.map.medalTimes.championTime, Medal.Champion),
    );
    records.sort((a, b) => a.time - b.time);
  }

  const content = {
    map: {
      gameId: data.event.edition.map.gameId,
      player: data.event.edition.map.player,
      cpsNumber: data.event.edition.map.cpsNumber ?? undefined,
      records: records,
    }
  } satisfies MapContent;

  return (
    <MapRecordsContent.MapRecordsContent
      data={content}
      toolbarTitle={(
        <ToolbarTitle
          mapName={data.event.edition.map.name}
          mapUid={dataRaw.event.edition?.map.originalMap?.gameId
            || dataRaw.event.edition?.map.linkToOriginal && data.event.edition.map.gameId
            || undefined
          }
          eventHandle={sp.params.eventHandle}
          editionId={editionId}
          eventName={eventName}
        />
      )}
    />
  );
}
