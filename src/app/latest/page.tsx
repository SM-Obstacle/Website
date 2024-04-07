import { gql } from "../__generated__/gql";
import Time, { Date, formatDate, formatFull } from "@/components/Time";
import { MPFormatLink } from "@/components/MPFormat";
import { ServerProps, getSortState } from "@/lib/server-props";
import { fetchGraphql } from "@/lib/utils";
import { GlobalRankedRecord } from "@/lib/ranked-record";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";

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

export default async function LatestRecords({
  searchParams
}: ServerProps<{}, { dateSortBy?: string }>) {
  const dateSortBy = getSortState(searchParams.dateSortBy);
  const records = (await fetchGraphql(GET_RECORDS, { dateSortBy })).records as GlobalRankedRecord[];

  return (
    <Table>
      <Thead>
        <Tr>
          <Th rank hideRespv><span>Rank</span></Th>
          <Th player padRespvFirst><span>Player</span></Th>
          <Th map><span>Map</span></Th>
          <Th time padRespvLast><span>Time</span></Th>
          <Th date hideRespv><span>Date</span></Th>
        </Tr>
      </Thead>
      <Tbody>
        {records.map((record) => (
          <Tr key={record.id}>
            <Td rank respvUnpadRank>{record.rank}</Td>
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
            <Td date respvAbsoluteDate title={formatFull(record.recordDate)}>
              <Date onlyDate>{record.recordDate}</Date>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}