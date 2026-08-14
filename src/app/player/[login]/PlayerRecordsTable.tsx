"use client";

import { useQuery } from "@apollo/client/react";

import { gql } from "@/app/__generated__";
import FormattedDate from "@/components/FormattedDate";
import { SubPanel } from "@/components/layout/Panel";
import { MPFormatLink } from "@/components/MPFormat";
import {
  Leaderboard,
  LeaderboardBody,
  LeaderboardHead,
  LeaderboardHeader,
  LeaderboardRow,
  NameCell,
  RankCell,
  TimeCell,
  WideOnlyCell,
  WideOnlyHead,
} from "@/components/tables/Leaderboard";
import PaginationControls from "@/components/tables/PaginationControls";
import {
  TableError,
  TableMessage,
  TableSkeleton,
} from "@/components/tables/TableStates";
import Time from "@/components/Time";
import { useUrlParams } from "@/hooks/useUrlParams";
import { readPagination } from "@/lib/pagination";

const GET_PLAYER_RECORDS = gql(/* GraphQL */ `
  query GetPlayerRecords(
    $login: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    player(login: $login) {
      recordsConnection(
        first: $first
        last: $last
        after: $after
        before: $before
      ) {
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        nodes {
          map {
            gameId
            name
          }
          ...RecordBase
        }
      }
    }
  }
`);

const COLUMNS = 4;
const PAGE_SIZE = 25;

export default function PlayerRecordsTable({ login }: { login: string }) {
  const { searchParams } = useUrlParams();

  const { data, previousData, loading, error } = useQuery(GET_PLAYER_RECORDS, {
    variables: { login, ...readPagination(searchParams, PAGE_SIZE) },
    notifyOnNetworkStatusChange: true,
  });

  const connection = (data ?? previousData)?.player.recordsConnection;
  const records = connection?.nodes;

  return (
    <>
      <SubPanel className="scrollbar-slim min-h-0 flex-1 overflow-y-auto">
        <Leaderboard>
          <LeaderboardHeader>
            <LeaderboardRow>
              <LeaderboardHead className="w-[10%] text-center">
                #
              </LeaderboardHead>
              <LeaderboardHead>Map</LeaderboardHead>
              <LeaderboardHead className="w-[20%]">Time</LeaderboardHead>
              <WideOnlyHead className="w-[20%] text-right">Date</WideOnlyHead>
            </LeaderboardRow>
          </LeaderboardHeader>

          {error ? (
            <TableError columns={COLUMNS} message={error.message} />
          ) : !records ? (
            <TableSkeleton columns={COLUMNS} rows={8} />
          ) : records.length === 0 ? (
            <TableMessage columns={COLUMNS}>
              This player has no record yet.
            </TableMessage>
          ) : (
            <LeaderboardBody className={loading ? "opacity-60" : undefined}>
              {records.map((record) => (
                <LeaderboardRow key={record.id}>
                  <RankCell>{record.rank}</RankCell>
                  <NameCell>
                    <MPFormatLink path={`/map/${record.map.gameId}`}>
                      {record.map.name}
                    </MPFormatLink>
                  </NameCell>
                  <TimeCell>
                    <Time>{record.time}</Time>
                  </TimeCell>
                  <WideOnlyCell className="text-right">
                    <FormattedDate onlyDate>{record.recordDate}</FormattedDate>
                  </WideOnlyCell>
                </LeaderboardRow>
              ))}
            </LeaderboardBody>
          )}
        </Leaderboard>
      </SubPanel>

      <SubPanel className="shrink-0">
        <PaginationControls pageInfo={connection?.pageInfo} disabled={loading} />
      </SubPanel>
    </>
  );
}
