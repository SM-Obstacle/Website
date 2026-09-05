"use client";

import { useQuery } from "@apollo/client/react";

import { gql } from "@/app/__generated__";
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
  WideOnlyCell,
  WideOnlyHead,
} from "@/components/tables/Leaderboard";
import PaginationControls from "@/components/tables/PaginationControls";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TableError,
  TableMessage,
  TableSkeleton,
} from "@/components/tables/TableStates";
import { useUrlParams } from "@/hooks/useUrlParams";
import { buildPlayersFilter } from "@/lib/filters";
import { readPagination } from "@/lib/pagination";
import { readSort } from "@/lib/sort";

const GET_PLAYERS = gql(/* GraphQL */ `
  query GetPlayers(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: PlayersFilter
    $sort: PlayerMapRankingSort
  ) {
    players(
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
        rank
        player {
          id
          login
          name
          score
        }
      }
    }
  }
`);

const COLUMNS = 3;

export default function PlayersTable() {
  const { searchParams } = useUrlParams();

  const { data, previousData, loading, error } = useQuery(GET_PLAYERS, {
    variables: {
      filter: buildPlayersFilter(searchParams),
      ...readPagination(searchParams),
      ...readSort(searchParams, "playerMapRanking"),
    },
    notifyOnNetworkStatusChange: true,
  });

  const connection = (data ?? previousData)?.players;
  const players = connection?.nodes;

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
                <WideOnlyHead className="w-[25%] text-right">Score</WideOnlyHead>
              </LeaderboardRow>
            </LeaderboardHeader>

            {error ? (
              <TableError columns={COLUMNS} message={error.message} />
            ) : !players ? (
              <TableSkeleton columns={COLUMNS} />
            ) : players.length === 0 ? (
              <TableMessage columns={COLUMNS}>
                No player matches these filters.
              </TableMessage>
            ) : (
              <LeaderboardBody className={loading ? "opacity-60" : undefined}>
                {players.map(({ rank, player }) => (
                  <LeaderboardRow key={player.id}>
                    <RankCell>{rank}</RankCell>
                    <NameCell>
                      <MPFormatLink path={`/player/${player.login}`}>
                        {player.name}
                      </MPFormatLink>
                    </NameCell>
                    <WideOnlyCell className="text-right">
                      <code>
                        {player.score.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </code>
                    </WideOnlyCell>
                  </LeaderboardRow>
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
