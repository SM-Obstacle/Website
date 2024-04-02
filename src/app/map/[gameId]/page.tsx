import { gql } from "@/app/__generated__";
import { GetMapInfoQuery, SortState } from "@/app/__generated__/graphql";
import { Metadata } from "next";
import { cache } from "react";
import MxButton from "./MxButton";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import Time, { Date } from "@/components/Time";
import { RankedRecordOfMap } from "@/lib/ranked-record";
import { fetchGraphql } from "@/lib/utils";
import { ServerProps, getSortState } from "@/lib/server-props";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import { ToolBarWrapper, ToolbarSpan, ToolbarTitle } from "@/components/ToolbarWrapper";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";

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
      gameId
      name
      cpsNumber
      reversed
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

export type MapRecordsProperty = GetMapInfoQuery["map"] & {
  records: RankedRecordOfMap[];
};

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

export async function _MapRecords({
  params,
  searchParams,
  fetchMapInfo
}: SP & {
  fetchMapInfo: (gameId: string, dateSortBy?: SortState, rankSortBy?: SortState) => Promise<GetMapInfoQuery>,
}) {
  const data = await fetchMapInfo(params.gameId, getSortState(searchParams["dateSortBy"]), getSortState(searchParams["rankSortBy"]));
  const mapInfo = data.map as MapRecordsProperty;

  let cpsNumberText = "";
  const cpsNumber = data.map.cpsNumber;
  if (typeof cpsNumber === "number") {
    cpsNumberText = `${cpsNumber} cp${cpsNumber > 1 ? 's' : ''}`
  }

  return (
    <>
      <ToolBarWrapper>
        <ToolbarTitle><MPFormat>{mapInfo.name}</MPFormat></ToolbarTitle>
        <ToolbarSpan>{cpsNumberText}</ToolbarSpan>
        <ToolbarSpan>
          By <MPFormatLink
            path={`/player/${mapInfo.player.login}`}
            name={mapInfo.player.name}
          />
        </ToolbarSpan>
        <MxButton gameId={mapInfo.gameId} />
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
          {mapInfo.records.map((record) => (
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
              <Td date respvAbsoluteDate>
                <Date onlyDate>{record.recordDate}</Date>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}

export default function MapRecords(sp: SP) {
  return _MapRecords({ ...sp, fetchMapInfo });
}