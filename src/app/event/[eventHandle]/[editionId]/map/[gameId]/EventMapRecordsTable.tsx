"use client";

import { useQuery } from "@apollo/client/react";

import { gql } from "@/app/__generated__";
import {
  MapRecordSortableField,
  SortOrder,
} from "@/app/__generated__/graphql";
import FormattedDate from "@/components/FormattedDate";
import { SubPanel } from "@/components/layout/Panel";
import { MedalImg } from "@/components/MedalImg";
import { MPFormatLink } from "@/components/MPFormat";
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
import { Medal } from "@/lib/ranked-record";

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
    }
  }
`);

const COLUMNS = 4;
const PAGE_SIZE = 25;

type MedalTimes = {
  bronzeTime: number;
  silverTime: number;
  goldTime: number;
  championTime: number;
};

type RecordRow = {
  kind: "record";
  id: number;
  rank: number;
  time: number;
  recordDate: string;
  player: { login: string; name: string };
};

type MedalRow = { kind: "medal"; medal: Medal; time: number };

const MEDAL_LABELS: Record<Medal, string> = {
  [Medal.Bronze]: "Bronze time",
  [Medal.Silver]: "Silver time",
  [Medal.Gold]: "Gold time",
  [Medal.Champion]: "Author time",
};

/**
 * Slots the medal times into the leaderboard so a player can see which medal
 * each record earned. A record that ties a medal time comes first.
 */
function withMedalRows(
  records: RecordRow[],
  medalTimes: MedalTimes | null | undefined,
): (RecordRow | MedalRow)[] {
  if (!medalTimes) return records;

  const medals: MedalRow[] = [
    { kind: "medal", medal: Medal.Bronze, time: medalTimes.bronzeTime },
    { kind: "medal", medal: Medal.Silver, time: medalTimes.silverTime },
    { kind: "medal", medal: Medal.Gold, time: medalTimes.goldTime },
    { kind: "medal", medal: Medal.Champion, time: medalTimes.championTime },
  ];

  return [...records, ...medals].sort(
    (a, b) =>
      a.time - b.time ||
      (a.kind === "medal" ? 1 : 0) - (b.kind === "medal" ? 1 : 0),
  );
}

export default function EventMapRecordsTable({
  eventHandle,
  editionId,
  gameId,
}: {
  eventHandle: string;
  editionId: number;
  gameId: string;
}) {
  const { searchParams } = useUrlParams();

  const order = searchParams.get("order");
  // The API's DESCENDING order walks dates upwards: oldest records first.
  const oldestFirst = order === "desc";

  const { data, previousData, loading, error } = useQuery(
    GET_EVENT_MAP_RECORDS,
    {
      variables: {
        eventHandle,
        editionId,
        gameId,
        ...readPagination(searchParams, PAGE_SIZE),
        ...(order && {
          sort: {
            field: MapRecordSortableField.Date,
            order: oldestFirst ? SortOrder.Descending : SortOrder.Ascending,
          },
        }),
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const map = (data ?? previousData)?.event.edition?.map;
  const connection = map?.recordsConnection;

  const records: RecordRow[] | undefined = connection?.nodes.map((node) => ({
    kind: "record",
    id: node.id,
    rank: node.rank,
    time: node.time,
    recordDate: node.recordDate,
    player: node.player,
  }));

  // Sorting by date would scatter the medal markers through the list.
  const rows = records
    ? order
      ? records
      : withMedalRows(records, map?.medalTimes)
    : undefined;

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
                  <LeaderboardRow key={`record-${row.id}`}>
                    <RankCell>{row.rank}</RankCell>
                    <NameCell>
                      <MPFormatLink path={`/player/${row.player.login}`}>
                        {row.player.name}
                      </MPFormatLink>
                    </NameCell>
                    <TimeCell>
                      <Time>{row.time}</Time>
                    </TimeCell>
                    <WideOnlyCell className="text-right">
                      <FormattedDate onlyDate>{row.recordDate}</FormattedDate>
                    </WideOnlyCell>
                  </LeaderboardRow>
                ) : (
                  <LeaderboardRow
                    key={`medal-${row.medal}`}
                    className="[&>td]:bg-black/60"
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
      </SubPanel>

      <SubPanel className="shrink-0">
        <PaginationControls pageInfo={connection?.pageInfo} disabled={loading} />
      </SubPanel>
    </>
  );
}
