import { gql } from "@/app/__generated__";
import { GetMapInfoQuery, SortState } from "@/app/__generated__/graphql";
import { Metadata } from "next";
import { cache } from "react";
import MxButton from "./MxButton";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import Time, { Date, formatDate, formatFull } from "@/components/Time";
import { RankedRecordOfMap } from "@/lib/ranked-record";
import { fetchGraphql } from "@/lib/utils";
import { ServerProps, getSortState } from "@/lib/server-props";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import { ToolBarWrapper, ToolbarSpan, ToolbarTitle as RawToolbarTitle, ToolbarTitleWrapper } from "@/components/ToolbarWrapper";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";
import Link from "@/components/Link";
import { redirect } from "next/navigation";

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

export function MapRecordsContent<Q extends MapRecordsProperty>({
  data,
  toolbarTitle,
}: {
  data: Q,
  toolbarTitle: React.ReactNode,
}) {
  let cpsNumberText = "";
  const cpsNumber = data.map.cpsNumber;
  if (typeof cpsNumber === "number") {
    cpsNumberText = `${cpsNumber} cp${cpsNumber > 1 ? 's' : ''}`
  }

  return (
    <>
      <ToolBarWrapper>
        {toolbarTitle}
        <ToolbarSpan>{cpsNumberText}</ToolbarSpan>
        <ToolbarSpan>
          By <MPFormatLink
            path={`/player/${data.map.player.login}`}
            name={data.map.player.name}
          />
        </ToolbarSpan>
        <MxButton gameId={data.map.gameId} />
      </ToolBarWrapper>

      <Table>
        <Thead>
          <Tr>
            <Th rank hideRespv><span>Rank</span></Th>
            <Th player padRespvFirst><span>Player</span></Th>
            <Th time padRespvLast><span>Time</span></Th>
            <Th date hideRespv><span>Date</span></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map.records.map((record) => (
            <Tr key={record.id}>
              <Td rank respvUnpadRank>{record.rank}</Td>
              <Td player respvMb>
                <MPFormatLink
                  path={`/player/${record.player.login}`}
                  name={record.player.name}
                />
              </Td>
              <Td time respvTime>
                <Time>{record.time}</Time>
              </Td>
              <Td date respvAbsoluteDate title={formatFull(record.recordDate)}>
                <Date onlyDate>{record.recordDate}</Date>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
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

  return (
    <MapRecordsContent data={data} toolbarTitle={
      <ToolbarTitle data={data} relatedEvent={relatedEvent} />
    } />
  );
}