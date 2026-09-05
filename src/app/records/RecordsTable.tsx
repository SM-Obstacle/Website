"use client";

import { useQuery } from "@apollo/client/react";
import { memo } from "react";

import { gql } from "@/app/__generated__";
import {
  type GetRecordsConnectionQuery,
  SortOrder,
} from "@/app/__generated__/graphql";
import FormattedDate from "@/components/FormattedDate";
import { SubPanel } from "@/components/layout/Panel";
import { MPFormatLink } from "@/components/MPFormat";
import NoPropagationLink from "@/components/NoPropagationLink";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { selectableRowProps, useRowSelection } from "@/hooks/useRowSelection";
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
          id
          gameId
          name
        }
        ...RecordBase
      }
    }
  }
`);

const COLUMNS = 5;

type RecordRowData = NonNullable<
  GetRecordsConnectionQuery["recordsConnection"]
>["nodes"][number];

/**
 * One row of the list.
 *
 * Picking a row rewrites the query string, which re-renders everything reading
 * it — this table included. Memoised on a record the cache hands back
 * unchanged, the fifty rows that didn't change then cost nothing, and only the
 * two whose highlight moved are rendered again.
 */
const RecordRow = memo(function RecordRow({
  record,
  selected,
  select,
}: {
  record: RecordRowData;
  selected: boolean;
  select: (value: string) => void;
}) {
  return (
    <LeaderboardRow
      {...selectableRowProps(String(record.id), selected, select)}
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
  );
});

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
  });

  const connection = (data ?? previousData)?.recordsConnection;
  const records = connection?.nodes;

  return (
    <>
      <SubPanel className="min-h-0 flex-1">
        <ScrollArea className="min-h-0 flex-1">
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
                  <RecordRow
                    key={record.id}
                    record={record}
                    selected={String(record.id) === selection.selected}
                    select={selection.select}
                  />
                ))}
              </LeaderboardBody>
            )}
          </Leaderboard>
        </ScrollArea>
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
