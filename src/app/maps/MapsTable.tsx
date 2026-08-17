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
import {
  TableError,
  TableMessage,
  TableSkeleton,
} from "@/components/tables/TableStates";
import { useUrlParams } from "@/hooks/useUrlParams";
import { buildMapsFilter } from "@/lib/filters";
import { readPagination } from "@/lib/pagination";
import { readSort } from "@/lib/sort";

const GET_MAPS = gql(/* GraphQL */ `
  query GetMaps(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: MapsFilter
    $sort: PlayerMapRankingSort
  ) {
    maps(
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
        map {
          id
          gameId
          name
          score
          player {
            login
            name
          }
        }
      }
    }
  }
`);

const COLUMNS = 4;

export default function MapsTable() {
  const { searchParams } = useUrlParams();

  const { data, previousData, loading, error } = useQuery(GET_MAPS, {
    variables: {
      filter: buildMapsFilter(searchParams),
      ...readPagination(searchParams),
      ...readSort(searchParams, "playerMapRanking"),
    },
    notifyOnNetworkStatusChange: true,
  });

  const connection = (data ?? previousData)?.maps;
  const maps = connection?.nodes;

  return (
    <>
      <SubPanel className="scrollbar-slim min-h-0 flex-1 overflow-y-auto">
        <Leaderboard>
          <LeaderboardHeader>
            <LeaderboardRow>
              <LeaderboardHead className="w-[10%] text-center">
                #
              </LeaderboardHead>
              <LeaderboardHead className="w-[40%]">Map</LeaderboardHead>
              <LeaderboardHead className="w-[35%]">Author</LeaderboardHead>
              <WideOnlyHead className="w-[20%] text-right">Score</WideOnlyHead>
            </LeaderboardRow>
          </LeaderboardHeader>

          {error ? (
            <TableError columns={COLUMNS} message={error.message} />
          ) : !maps ? (
            <TableSkeleton columns={COLUMNS} />
          ) : maps.length === 0 ? (
            <TableMessage columns={COLUMNS}>
              No map matches these filters.
            </TableMessage>
          ) : (
            <LeaderboardBody className={loading ? "opacity-60" : undefined}>
              {maps.map(({ rank, map }) => (
                <LeaderboardRow key={map.id}>
                  <RankCell>{rank}</RankCell>
                  <NameCell>
                    <MPFormatLink path={`/map/${map.gameId}`}>
                      {map.name}
                    </MPFormatLink>
                  </NameCell>
                  <NameCell>
                    <MPFormatLink path={`/player/${map.player.login}`}>
                      {map.player.name}
                    </MPFormatLink>
                  </NameCell>
                  <WideOnlyCell className="text-right">
                    <code>
                      {map.score.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </code>
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
