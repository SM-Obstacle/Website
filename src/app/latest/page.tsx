import TableRow from "@/components/TableRow";
import { gql } from "../__generated__/gql";
import Time, { Date } from "@/components/Time";
import { MPFormatLink } from "@/components/MPFormat";
import { ServerProps, getSortState } from "@/lib/server-props";
import { fetchGraphql } from "@/lib/utils";
import { GlobalRankedRecord } from "@/lib/ranked-record";

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
    <table>
      <thead>
        <tr>
          <th className="rank"><span>Rank</span></th>
          <th className="preview player"><span>Player</span></th>
          <th className="map"><span>Map</span></th>
          <th className="time"><span>Time</span></th>
          <th className="date"><span>Date</span></th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <td className="rank">{record.rank}</td>
            <td className="preview player">
              <MPFormatLink
                path={`/player/${record.player.login}`}
                name={record.player.name}
              />
            </td>
            <td className="map">
              <MPFormatLink
                path={`/map/${record.map.gameId}`}
                name={record.map.name}
              />
            </td>
            <td className="time">
              <Time>{record.time}</Time>
            </td>
            <td className="date">
              <Date onlyDate>{record.recordDate}</Date>
            </td>
          </TableRow>
        ))}
      </tbody>
    </table>
  )
}