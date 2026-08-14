"use client";

import { useQuery } from "@apollo/client/react";
import { Medal } from "lucide-react";

import { gql } from "@/app/__generated__";
import { FormattedTimeAgo } from "@/components/FormattedDate";
import { MPFormatLink } from "@/components/MPFormat";
import {
  Leaderboard,
  LeaderboardBody,
  LeaderboardCell,
  LeaderboardHead,
  LeaderboardHeader,
  LeaderboardRow,
  NameCell,
  TimeCell,
} from "@/components/tables/Leaderboard";
import { TableError, TableSkeleton } from "@/components/tables/TableStates";
import Time from "@/components/Time";
import { cn } from "@/lib/utils";

const GET_RECORDS = gql(/* GraphQL */ `
  query GetRecords(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $filter: RecordsFilter
  ) {
    recordsConnection(
      first: $first
      last: $last
      after: $after
      before: $before
      filter: $filter
    ) {
      nodes {
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
  }
`);

const COLUMNS = 5;

/** Colours the top three ranks like the podium medals. */
const PODIUM: Record<number, string> = {
  1: "text-medal-gold",
  2: "text-medal-silver",
  3: "text-medal-bronze",
};

export default function LatestRecords() {
  const { data, loading, error } = useQuery(GET_RECORDS, {
    variables: { first: 5 },
  });

  const records = data?.recordsConnection.nodes;

  return (
    <Leaderboard>
      <LeaderboardHeader className="text-base opacity-50">
        <LeaderboardRow>
          <LeaderboardHead className="w-[35%]">Player</LeaderboardHead>
          <LeaderboardHead className="w-[35%]">Map</LeaderboardHead>
          <LeaderboardHead className="w-[15%]">Time</LeaderboardHead>
          <LeaderboardHead className="hidden w-[10%] sm:table-cell">
            Date
          </LeaderboardHead>
          <LeaderboardHead className="w-[10%] text-right">#</LeaderboardHead>
        </LeaderboardRow>
      </LeaderboardHeader>

      {error ? (
        <TableError columns={COLUMNS} message={error.message} />
      ) : loading || !records ? (
        <TableSkeleton columns={COLUMNS} rows={5} />
      ) : (
        <LeaderboardBody>
          {records.map((record) => (
            <LeaderboardRow key={record.id}>
              <NameCell>
                <MPFormatLink
                  className="font-bold"
                  path={`/player/${record.player.login}`}
                >
                  {record.player.name}
                </MPFormatLink>
              </NameCell>
              <NameCell>
                <MPFormatLink
                  className="font-bold"
                  path={`/map/${record.map.gameId}`}
                >
                  {record.map.name}
                </MPFormatLink>
              </NameCell>
              <TimeCell className="not-italic">
                <Time>{record.time}</Time>
              </TimeCell>
              <LeaderboardCell className="hidden sm:table-cell">
                <FormattedTimeAgo>{record.recordDate}</FormattedTimeAgo>
              </LeaderboardCell>
              <LeaderboardCell
                className={cn(
                  "text-right",
                  PODIUM[record.rank] && `font-bold ${PODIUM[record.rank]}`,
                )}
              >
                <span className="inline-flex items-center justify-end gap-1">
                  <Medal className="size-4" />
                  {record.rank}
                </span>
              </LeaderboardCell>
            </LeaderboardRow>
          ))}
        </LeaderboardBody>
      )}
    </Leaderboard>
  );
}
