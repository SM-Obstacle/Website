import type { Metadata } from "next";
import { cache } from "react";
import { gql } from "@/app/__generated__";
import type { SortState } from "@/app/__generated__/graphql";
import { query } from "@/app/ApolloClient";
import FormattedDate from "@/components/FormattedDate";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";
import Time from "@/components/Time";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import { getSortState, type ServerProps } from "@/lib/server-props";
import PlayerToolbar from "./PlayerToolbar";

const _PLAYER_RECORDS_FRAGMENT = gql(/* GraphQL */ `
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

// FIXME: this seems to be unsused
const _SORT_PLAYER_RECORDS = gql(/* GraphQL */ `
  query SortPlayerRecords($login: String!, $dateSortBy: SortState) {
    player(login: $login) {
      ...PlayerRecords
    }
  }
`);

const fetchPlayerInfo = cache(async (login: string, dateSortBy?: SortState) => {
  return query({ query: GET_PLAYER_INFO, variables: { login, dateSortBy } });
});

type SP = ServerProps<{ login: string }, { dateSortBy?: string }>;

export async function generateMetadata(props: SP): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const playerInfo = (
    await fetchPlayerInfo(params.login, getSortState(searchParams.dateSortBy))
  ).data?.player;

  return {
    title: toPlainText(parse(playerInfo?.name ?? "")),
  };
}

export default async function PlayerRecords(props: SP) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const data = await fetchPlayerInfo(
    params.login,
    getSortState(searchParams.dateSortBy),
  );

  return (
    <>
      <PlayerToolbar
        role={data.data?.player.role ?? ""}
        zonePath={data.data?.player.zonePath ?? ""}
      >
        <MPFormat>{data.data?.player.name ?? ""}</MPFormat>
      </PlayerToolbar>

      <Table>
        <Thead>
          <Tr>
            <Th rank hideRespv>
              <span>Rank</span>
            </Th>
            <Th map padRespvFirst>
              <span>Map</span>
            </Th>
            <Th time padRespvLast>
              <span>Time</span>
            </Th>
            <Th date hideRespv>
              <span>Date</span>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {(data.data?.player.records ?? []).map((record) => (
            <Tr key={record.id}>
              <Td rank respvUnpadRank>
                {record.rank}
              </Td>
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
                <FormattedDate onlyDate>{record.recordDate}</FormattedDate>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
