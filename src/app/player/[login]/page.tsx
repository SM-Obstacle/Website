import type { Metadata } from "next";
import { cache } from "react";
import { gql } from "@/app/__generated__";
import type { RecordsFilter } from "@/app/__generated__/graphql";
import { query } from "@/app/ApolloClient";
import FormattedDate from "@/components/FormattedDate";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";
import Time from "@/components/Time";
import {
  type PaginationInput,
  parsePaginationInput,
  type RawPaginationInput,
} from "@/lib/cursor-pagination";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import {
  parseRecordsFilter,
  type RawRecordsFilter,
} from "@/lib/records-filter";
import type { ServerProps } from "@/lib/server-props";
import PlayerToolbar from "./PlayerToolbar";

const _PLAYER_RECORDS_FRAGMENT = gql(/* GraphQL */ `
  fragment PlayerRecords on Player {
    recordsConnection(
      first: $first
      last: $last
      after: $after
      before: $before
      filter: $filter
    ) {
      nodes {
        map {
          gameId
          name
        }
        ...RecordBase
      }
    }
  }
`);

const GET_PLAYER_INFO = gql(/* GraphQL */ `
  query GetPlayerInfo(
    $login: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $filter: RecordsFilter
  ) {
    player(login: $login) {
      login
      name
      zonePath
      role
      ...PlayerRecords
    }
  }
`);

const fetchPlayerInfo = cache(
  async (
    login: string,
    paginationInput: PaginationInput,
    filter: RecordsFilter,
  ) => {
    return query({
      query: GET_PLAYER_INFO,
      variables: { login, filter, ...paginationInput },
      errorPolicy: "all",
    });
  },
);

type SP = ServerProps<{ login: string }, RawPaginationInput & RawRecordsFilter>;

export async function generateMetadata(props: SP): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const playerInfo = (
    await fetchPlayerInfo(
      params.login,
      parsePaginationInput(searchParams),
      parseRecordsFilter(searchParams),
    )
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
    parsePaginationInput(searchParams),
    parseRecordsFilter(searchParams),
  );

  return data.error ? (
    data.error.message
  ) : (
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
          {(data.data?.player.recordsConnection.nodes ?? []).map((record) => (
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
