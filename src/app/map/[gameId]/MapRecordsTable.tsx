"use client";

import { useQuery } from "@apollo/client/react";

import { gql } from "@/app/__generated__";
import { MapRecordSortableField, SortOrder } from "@/app/__generated__/graphql";
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
import DateSortButton from "@/components/tables/DateSortButton";
import {
  TableError,
  TableMessage,
  TableSkeleton,
} from "@/components/tables/TableStates";
import Time from "@/components/Time";
import { useUrlParams } from "@/hooks/useUrlParams";
import { readPagination } from "@/lib/pagination";
import { readSort } from "@/lib/sort";

const GET_MAP_RECORDS = gql(/* GraphQL */ `
  query GetMapRecords(
    $gameId: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $sort: MapRecordSort
  ) {
    map(gameId: $gameId) {
      recordsConnection(
        first: $first
        last: $last
        after: $after
        before: $before
        sort: $sort
      ) {
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        nodes {
          player {
            login
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

export default function MapRecordsTable({ gameId }: { gameId: string }) {
  const { searchParams } = useUrlParams();

  const sort = readSort(searchParams, "mapRecords");

  const { data, previousData, loading, error } = useQuery(GET_MAP_RECORDS, {
    variables: {
      gameId,
      ...readPagination(searchParams, PAGE_SIZE),
      ...sort,
    },
    notifyOnNetworkStatusChange: true,
  });

  const connection = (data ?? previousData)?.map.recordsConnection;
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
              <LeaderboardHead>Player</LeaderboardHead>
              <LeaderboardHead className="w-[20%]">Time</LeaderboardHead>
              <WideOnlyHead className="w-[20%]">
                <span className="flex items-center justify-end gap-1">
                  <DateSortButton
                    oldestFirst={
                      sort.sort?.field === MapRecordSortableField.Date &&
                      sort.sort.order === SortOrder.Descending
                    }
                  />
                  Date
                </span>
              </WideOnlyHead>
            </LeaderboardRow>
          </LeaderboardHeader>

          {error ? (
            <TableError columns={COLUMNS} message={error.message} />
          ) : !records ? (
            <TableSkeleton columns={COLUMNS} rows={8} />
          ) : records.length === 0 ? (
            <TableMessage columns={COLUMNS}>
              No record has been set on this map yet.
            </TableMessage>
          ) : (
            <LeaderboardBody className={loading ? "opacity-60" : undefined}>
              {records.map((record) => (
                <LeaderboardRow key={record.id}>
                  <RankCell>{record.rank}</RankCell>
                  <NameCell>
                    <MPFormatLink path={`/player/${record.player.login}`}>
                      {record.player.name}
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
        <PaginationControls
          pageInfo={connection?.pageInfo}
          disabled={loading}
        />
      </SubPanel>
    </>
  );
}
