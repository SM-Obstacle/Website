import FormattedDate from "@/components/FormattedDate";
import { MPFormatLink } from "@/components/MPFormat";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";
import Time from "@/components/Time";
import type { GlobalRankedRecord } from "@/lib/ranked-record";
import { getSortState, type ServerProps } from "@/lib/server-props";
import { gql } from "../__generated__/gql";
import { query } from "../ApolloClient";

const GET_RECORDS = gql(/* GraphQL */ `
  query GetRecords($dateSortBy: SortState) {
    records(dateSortBy: $dateSortBy) {
      player {
        login
        name
      }
      map {
        gameId
        name
      }
      ...RecordBase
    }
  }
`);

export default async function LatestRecords(
  props: ServerProps<Record<string, never>, { dateSortBy?: string }>,
) {
  const searchParams = await props.searchParams;
  const dateSortBy = getSortState(searchParams.dateSortBy);
  const records = (
    await query({
      query: GET_RECORDS,
      variables: { dateSortBy },
    })
  ).data?.records as GlobalRankedRecord[];

  return (
    <Table>
      <Thead>
        <Tr>
          <Th rank hideRespv>
            <span>Rank</span>
          </Th>
          <Th player padRespvFirst>
            <span>Player</span>
          </Th>
          <Th map>
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
        {records.map((record) => (
          <Tr key={record.id}>
            <Td rank respvUnpadRank>
              {record.rank}
            </Td>
            <Td player respvMb>
              <MPFormatLink
                path={`/player/${record.player.login}`}
                name={record.player.name}
              />
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
  );
}
