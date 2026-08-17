"use client";

import { useQuery } from "@apollo/client/react";

import { gql } from "@/app/__generated__";
import {
  SortOrder,
  UnorderedRecordSortableField,
} from "@/app/__generated__/graphql";
import FormattedDate from "@/components/FormattedDate";
import { SubPanel } from "@/components/layout/Panel";
import { MPFormatLink } from "@/components/MPFormat";
import NoPropagationLink from "@/components/NoPropagationLink";
import RecordDialog from "@/components/records/RecordDialog";
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
import { useRowSelection } from "@/hooks/useRowSelection";
import { useUrlParams } from "@/hooks/useUrlParams";
import { buildRecordsFilter } from "@/lib/filters";
import { readPagination } from "@/lib/pagination";
import { readSort } from "@/lib/sort";

const GET_RECORDS = gql(/* GraphQL */ `
  query GetRecordsConnection(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: RecordsFilter
    $sort: UnorderedRecordSort
  ) {
    recordsConnection(
      first: $first
      last: $last
      before: $before
      after: $after
      filter: $filter
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

export default function RecordsTable() {
  const { searchParams } = useUrlParams();
  const selection = useRowSelection("record");

  const sort = readSort(searchParams, "unorderedRecords");

  const { data, previousData, loading, error } = useQuery(GET_RECORDS, {
    variables: {
      filter: buildRecordsFilter(searchParams),
      ...readPagination(searchParams),
      ...sort,
    },
    notifyOnNetworkStatusChange: true,
  });

  const connection = (data ?? previousData)?.recordsConnection;
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
              <LeaderboardHead className="w-[35%]">Player</LeaderboardHead>
              <LeaderboardHead className="w-[35%]">Map</LeaderboardHead>
              <LeaderboardHead className="w-[20%]">Time</LeaderboardHead>
              <WideOnlyHead className="w-[20%]">
                <span className="flex items-center justify-end gap-1">
                  <DateSortButton
                    oldestFirst={sort.sort?.order === SortOrder.Descending}
                  />
                  Date
                </span>
              </WideOnlyHead>
            </LeaderboardRow>
          </LeaderboardHeader>

          {error ? (
            <TableError columns={COLUMNS} message={error.message} />
          ) : !records ? (
            <TableSkeleton columns={COLUMNS} />
          ) : records.length === 0 ? (
            <TableMessage columns={COLUMNS}>
              No record matches these filters.
            </TableMessage>
          ) : (
            <LeaderboardBody className={loading ? "opacity-60" : undefined}>
              {records.map((record) => (
                <LeaderboardRow
                  key={record.id}
                  {...selection.rowProps(String(record.id))}
                >
                  <RankCell>{record.rank}</RankCell>
                  <NameCell>
                    <MPFormatLink
                      component={NoPropagationLink}
                      path={`/player/${record.player.login}`}
                    >
                      {record.player.name}
                    </MPFormatLink>
                  </NameCell>
                  <NameCell>
                    <MPFormatLink
                      component={NoPropagationLink}
                      path={`/map/${record.map.gameId}`}
                    >
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
        <PaginationControls
          pageInfo={connection?.pageInfo}
          disabled={loading}
        />
      </SubPanel>

      <RecordDialog recordId={selection.selected} onClose={selection.close} />
    </>
  );
}
