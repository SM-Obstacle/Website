import { gql } from "@/app/__generated__";
import { GetMapInfoQuery, SortState } from "@/app/__generated__/graphql";
import { Metadata } from "next";
import { cache } from "react";
import MPFormat from "@/components/MPFormat";
import { fetchGraphql } from "@/lib/utils";
import { ServerProps, getSortState } from "@/lib/server-props";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import { ToolbarTitle as RawToolbarTitle, ToolbarTitleWrapper } from "@/components/ToolbarWrapper";
import Link from "@/components/Link";
import { redirect } from "next/navigation";
import { MapRecordsContent } from "./MapRecordsContent";
import { MapContent, RankedRecordLine } from "@/lib/map-page-types";

const MAP_RECORDS_FRAGMENT = gql(/* GraphQL */ `
  fragment MapRecords on Map {
    records(rankSortBy: $rankSortBy, dateSortBy: $dateSortBy) {
      player {
        login
        name
      }
      ...RecordBase
    }
  }
`);

const GET_MAP_INFO = gql(/* GraphQL */ `
  query GetMapInfo(
    $gameId: String!
    $dateSortBy: SortState
    $rankSortBy: SortState
  ) {
    map(gameId: $gameId) {
      relatedEventEditions {
        map {
          gameId
        }
        redirectToEvent
        edition {
          name
          subtitle
          event {
            handle
          }
          id
        }
      }
      gameId
      name
      cpsNumber
      player {
        login
        name
      }
      ...MapRecords
    }
  }
`);

const SORT_MAP_RECORDS = gql(/* GraphQL */ `
  query SortMapRecords(
    $gameId: String!
    $dateSortBy: SortState
    $rankSortBy: SortState
  ) {
    map(gameId: $gameId) {
      ...MapRecords
    }
  }
`);

export type SP = ServerProps<{ gameId: string }, { dateSortBy?: string, rankSortBy?: string }>;

type Item<Array> = Array extends (infer T)[] ? T : never;
type RelatedEventEdition = Item<GetMapInfoQuery["map"]["relatedEventEditions"]>;
export type MapRecordsProperty = { map: Omit<GetMapInfoQuery["map"], "relatedEventEditions" | "__typename"> };

const fetchMapInfo = cache(async (gameId: string, dateSortBy?: SortState, rankSortBy?: SortState) => {
  return fetchGraphql(GET_MAP_INFO, { gameId, dateSortBy, rankSortBy });
});

export async function generateMetadata(
  {
    params,
    searchParams,
  }: SP,
): Promise<Metadata> {
  const mapInfo = (await fetchMapInfo(params.gameId, getSortState(searchParams["dateSortBy"]), getSortState(searchParams["rankSortBy"]))).map;

  return {
    title: toPlainText(parse(mapInfo.name)),
  };
}

function ToolbarTitle({
  data,
  relatedEvent,
}: {
  data: GetMapInfoQuery,
  relatedEvent: RelatedEventEdition,
}) {
  return relatedEvent ? (
    <ToolbarTitleWrapper>
      <RawToolbarTitle><MPFormat>{data.map.name}</MPFormat></RawToolbarTitle>
      {<span>Related to <Link explicit href={`/event/${relatedEvent.edition.event.handle}/${relatedEvent.edition.id}/map/${relatedEvent.map.gameId}`}>
        {relatedEvent.edition.name + (relatedEvent.edition.subtitle ? " " + relatedEvent.edition.subtitle : '')}
      </Link></span>}
    </ToolbarTitleWrapper>
  ) : (
    <RawToolbarTitle><MPFormat>{data.map.name}</MPFormat></RawToolbarTitle>
  );
}

export default async function MapRecords(sp: SP) {
  const data = await fetchMapInfo(
    sp.params.gameId,
    getSortState(sp.searchParams.dateSortBy),
    getSortState(sp.searchParams.rankSortBy)
  );

  const relatedEvent = data.map.relatedEventEditions && data.map.relatedEventEditions[0];

  if (relatedEvent?.redirectToEvent) {
    return redirect(`/event/${relatedEvent.edition.event.handle}/${relatedEvent.edition.id}/map/${sp.params.gameId}`);
  }

  const content = {
    map: {
      gameId: data.map.gameId,
      player: data.map.player,
      cpsNumber: data.map.cpsNumber ?? undefined,
      records: data.map.records.map((record) => new RankedRecordLine(record.id, record.rank, record.player, record.time, record.recordDate))
    }
  } satisfies MapContent;

  return (
    <MapRecordsContent data={content} toolbarTitle={
      <ToolbarTitle data={data} relatedEvent={relatedEvent} />
    } />
  );
}