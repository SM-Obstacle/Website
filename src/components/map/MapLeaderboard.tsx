"use client";

import { skipToken, useQuery } from "@apollo/client/react";
import { memo } from "react";

import { gql } from "@/app/__generated__";
import {
  type MapRecordsFragment,
  MapRecordSortableField,
  SortOrder,
} from "@/app/__generated__/graphql";
import FormattedDate from "@/components/FormattedDate";
import { SubPanel } from "@/components/layout/Panel";
import { MedalImg } from "@/components/MedalImg";
import { MPFormatLink } from "@/components/MPFormat";
import NoPropagationLink from "@/components/NoPropagationLink";
import {
  Leaderboard,
  LeaderboardBody,
  LeaderboardCell,
  LeaderboardHead,
  LeaderboardHeader,
  LeaderboardRow,
  NameCell,
  RankCell,
  TimeCell,
  WideOnlyCell,
  WideOnlyHead,
} from "@/components/tables/Leaderboard";
import DateSortButton from "@/components/tables/DateSortButton";
import PaginationControls from "@/components/tables/PaginationControls";
import {
  TableError,
  TableMessage,
  TableSkeleton,
} from "@/components/tables/TableStates";
import Time from "@/components/Time";
import { ScrollArea } from "@/components/ui/scroll-area";
import { selectableRowProps, useRowSelection } from "@/hooks/useRowSelection";
import { useUrlParams } from "@/hooks/useUrlParams";
import { readPagination } from "@/lib/pagination";
import { Medal } from "@/lib/ranked-record";

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
        ...MapRecords
      }
    }
  }
`);

const GET_EVENT_MAP_RECORDS = gql(/* GraphQL */ `
  query GetEventMapRecords(
    $eventHandle: String!
    $editionId: Int!
    $gameId: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $sort: MapRecordSort
  ) {
    event(handle: $eventHandle) {
      edition(editionId: $editionId) {
        map(gameId: $gameId) {
          medalTimes {
            bronzeTime
            silverTime
            goldTime
            championTime
          }
          recordsConnection(
            first: $first
            last: $last
            after: $after
            before: $before
            sort: $sort
          ) {
            ...MapRecords
          }
        }
      }
    }
  }
`);

const COLUMNS = 4;
const PAGE_SIZE = 25;

type RecordNode = MapRecordsFragment["nodes"][number];

type MedalTimes = {
  bronzeTime: number;
  silverTime: number;
  goldTime: number;
  championTime: number;
};

/** A row of the leaderboard: someone's record, or a medal to beat. */
type Row =
  | { kind: "record"; time: number; record: RecordNode }
  | { kind: "medal"; time: number; medal: Medal };

const MEDAL_LABELS: Record<Medal, string> = {
  [Medal.Bronze]: "Bronze time",
  [Medal.Silver]: "Silver time",
  [Medal.Gold]: "Gold time",
  [Medal.Champion]: "Author time",
};

/**
 * Slots the medal times into the leaderboard so a player can see which medal
 * each record earned. A record that ties a medal time comes first.
 *
 * Only an event edition sets medal times; anywhere else this just walks the
 * records through.
 */
function withMedalRows(
  records: readonly RecordNode[],
  medalTimes: MedalTimes | null | undefined,
): Row[] {
  const rows: Row[] = records.map((record) => ({
    kind: "record",
    time: record.time,
    record,
  }));

  if (!medalTimes) return rows;

  const medals: Row[] = [
    { kind: "medal", medal: Medal.Bronze, time: medalTimes.bronzeTime },
    { kind: "medal", medal: Medal.Silver, time: medalTimes.silverTime },
    { kind: "medal", medal: Medal.Gold, time: medalTimes.goldTime },
    { kind: "medal", medal: Medal.Champion, time: medalTimes.championTime },
  ];

  return [...rows, ...medals].sort(
    (a, b) =>
      a.time - b.time ||
      (a.kind === "medal" ? 1 : 0) - (b.kind === "medal" ? 1 : 0),
  );
}

/**
 * One row of the leaderboard.
 *
 * Picking a row rewrites the query string, which re-renders everything reading
 * it — this table included. Memoised on a record the cache hands back
 * unchanged, only the two rows whose highlight moved are rendered again.
 */
const MapRecordRow = memo(function MapRecordRow({
  record,
  selected,
  select,
}: {
  record: RecordNode;
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
      <TimeCell>
        <Time>{record.time}</Time>
      </TimeCell>
      <WideOnlyCell className="text-right">
        <FormattedDate onlyDate>{record.recordDate}</FormattedDate>
      </WideOnlyCell>
    </LeaderboardRow>
  );
});

/**
 * The records set on a map, and the details of whichever one is picked.
 *
 * An event edition keeps its own records for its own copy of a map, so where
 * they are read from is all that `event` changes: the rows, the paging and the
 * selection are the same either way.
 */
export default function MapLeaderboard({
  gameId,
  event,
}: {
  gameId: string;
  event?: { handle: string; editionId: number };
}) {
  const { searchParams } = useUrlParams();
  const selection = useRowSelection("record");

  const order = searchParams.get("order");
  // The API's DESCENDING order walks dates upwards: oldest records first.
  const oldestFirst = order === "desc";

  const variables = {
    gameId,
    ...readPagination(searchParams, PAGE_SIZE),
    // Left alone, the leaderboard comes back in rank order — the only
    // ordering worth showing until someone asks for dates.
    ...(order && {
      sort: {
        field: MapRecordSortableField.Date,
        order: oldestFirst ? SortOrder.Descending : SortOrder.Ascending,
      },
    }),
  };

  // The two leaderboards hang off different fields of the schema, so the query
  // is the one thing that still changes with the page. Both hooks are declared
  // — hooks always run — and the one this page has no use for is skipped.
  const mapRecords = useQuery(
    GET_MAP_RECORDS,
    event ? skipToken : { variables, notifyOnNetworkStatusChange: true },
  );
  const eventRecords = useQuery(
    GET_EVENT_MAP_RECORDS,
    event
      ? {
          variables: {
            ...variables,
            eventHandle: event.handle,
            editionId: event.editionId,
          },
          notifyOnNetworkStatusChange: true,
        }
      : skipToken,
  );

  const { loading, error } = event ? eventRecords : mapRecords;

  const eventMap = (eventRecords.data ?? eventRecords.previousData)?.event
    .edition?.map;
  const connection = event
    ? eventMap?.recordsConnection
    : (mapRecords.data ?? mapRecords.previousData)?.map.recordsConnection;

  // Sorting by date would scatter the medal markers through the list.
  const rows =
    connection &&
    withMedalRows(connection.nodes, order ? null : eventMap?.medalTimes);

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
                <LeaderboardHead>Player</LeaderboardHead>
                <LeaderboardHead className="w-[20%]">Time</LeaderboardHead>
                <WideOnlyHead className="w-[20%]">
                  <span className="flex items-center justify-end gap-1">
                    <DateSortButton oldestFirst={oldestFirst} />
                    Date
                  </span>
                </WideOnlyHead>
              </LeaderboardRow>
            </LeaderboardHeader>

            {error ? (
              <TableError columns={COLUMNS} message={error.message} />
            ) : !rows ? (
              <TableSkeleton columns={COLUMNS} rows={8} />
            ) : rows.length === 0 ? (
              <TableMessage columns={COLUMNS}>
                No record has been set on this map yet.
              </TableMessage>
            ) : (
              <LeaderboardBody className={loading ? "opacity-60" : undefined}>
                {rows.map((row) =>
                  row.kind === "record" ? (
                    <MapRecordRow
                      key={`record-${row.record.id}`}
                      record={row.record}
                      selected={String(row.record.id) === selection.selected}
                      select={selection.select}
                    />
                  ) : (
                    <LeaderboardRow
                      key={`medal-${row.medal}`}
                      className="[&>td]:bg-sunken"
                    >
                      <LeaderboardCell className="flex justify-end">
                        <MedalImg mdl={row.medal} />
                      </LeaderboardCell>
                      <NameCell className="italic">
                        {MEDAL_LABELS[row.medal]}
                      </NameCell>
                      <TimeCell>
                        <Time>{row.time}</Time>
                      </TimeCell>
                      <WideOnlyCell />
                    </LeaderboardRow>
                  ),
                )}
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
