import { gql } from "@/app/__generated__";
import { GetPlayerInfoQuery, SortState } from "@/app/__generated__/graphql";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";
import Time, { Date } from "@/components/Time";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import { RankedRecordOfPlayer } from "@/lib/ranked-record";
import { ServerProps, getSortState } from "@/lib/server-props";
import { fetchGraphql } from "@/lib/utils";
import { Metadata } from "next";
import { cache } from "react";
import PlayerToolbar from "./PlayerToolbar";

const PLAYER_RECORDS_FRAGMENT = gql(/* GraphQL */ `
  fragment PlayerRecords on Player {
    records(dateSortBy: $dateSortBy) {
      map {
        gameId
        name
      }
      ...RecordBase
    }
  }
`);

const GET_PLAYER_INFO = gql(/* GraphQL */ `
  query GetPlayerInfo($login: String!, $dateSortBy: SortState) {
    player(login: $login) {
      login
      name
      zonePath
      role
      ...PlayerRecords
    }
  }
`);

const SORT_PLAYER_RECORDS = gql(/* GraphQL */ `
  query SortPlayerRecords($login: String!, $dateSortBy: SortState) {
    player(login: $login) {
      ...PlayerRecords
    }
  }
`);

type PlayerRecordsProperty = GetPlayerInfoQuery["player"] & {
  records: RankedRecordOfPlayer[];
};

const fetchPlayerInfo = cache(async (login: string, dateSortBy?: SortState) => {
  return fetchGraphql(GET_PLAYER_INFO, { login, dateSortBy });
});

type SP = ServerProps<{ login: string }, { dateSortBy?: string }>;

export async function generateMetadata(
  {
    params,
    searchParams,
  }: SP,
): Promise<Metadata> {
  const playerInfo = (await fetchPlayerInfo(params.login, getSortState(searchParams.dateSortBy))).player;

  return {
    title: toPlainText(parse(playerInfo.name)),
  };
}

export default async function PlayerRecords({
  params,
  searchParams,
}: SP) {
  const data = await fetchPlayerInfo(params.login, getSortState(searchParams["dateSortBy"]));

  return (
    <>
      <PlayerToolbar
        role={data.player.role}
        zonePath={data.player.zonePath}
      >
        <MPFormat>{data.player.name}</MPFormat>
      </PlayerToolbar>

      <Table>
        <Thead>
          <Tr>
            <Th rank hideRespv><span>Rank</span></Th>
            <Th map padRespvFirst><span>Map</span></Th>
            <Th time padRespvLast><span>Time</span></Th>
            <Th date hideRespv><span>Date</span></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.player.records.map((record) => (
            <Tr key={record.id}>
              <Td rank respvUnpadRank>{record.rank}</Td>
              <Td map respvMb>
                <MPFormatLink
                  path={`/map/${record.map.gameId}`}
                  name={record.map.name}
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
  )
}