"use client";

import { useQuery } from "@apollo/client/react";
import { memo } from "react";

import { gql } from "@/app/__generated__";
import type { GetPlayerRecordsQuery } from "@/app/__generated__/graphql";
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
import {
  TableError,
  TableMessage,
  TableSkeleton,
} from "@/components/tables/TableStates";
import Time from "@/components/Time";
import { selectableRowProps, useRowSelection } from "@/hooks/useRowSelection";
import { useUrlParams } from "@/hooks/useUrlParams";
import { readPagination } from "@/lib/pagination";
import { RECORD_SELECTION } from "./playerPanel";

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
            id
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

type PlayerRecordRowData =
  GetPlayerRecordsQuery["player"]["recordsConnection"]["nodes"][number];

/**
 * One row of the list.
 *
 * Picking a row rewrites the query string, which re-renders everything reading
 * it — this table included. Memoised on a record the cache hands back
 * unchanged, only the two rows whose highlight moved are rendered again.
 */
const PlayerRecordRow = memo(function PlayerRecordRow({
  record,
  selected,
  select,
}: {
  record: PlayerRecordRowData;
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

export default function PlayerRecordsTable({ login }: { login: string }) {
  const { searchParams } = useUrlParams();
  const selection = useRowSelection("record", RECORD_SELECTION);

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
                <PlayerRecordRow
                  key={record.id}
                  record={record}
                  selected={String(record.id) === selection.selected}
                  select={selection.select}
                />
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
