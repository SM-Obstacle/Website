"use client";

import { useQuery } from "@apollo/client/react";

import { gql } from "@/app/__generated__";
import { useOpenedPanel } from "@/components/layout/DetailAside";
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
} from "@/components/tables/Leaderboard";
import { TableSkeleton } from "@/components/tables/TableStates";
import { Skeleton } from "@/components/ui/skeleton";

const GET_MAPPACK_PLAYER_INFO = gql(/* GraphQL */ `
  query GetMappackPlayerInfo($mappackId: String!, $login: String!) {
    mappack(mappackId: $mappackId) {
      ...MappackPlayerInfo
    }
  }
`);

export function useMappackPlayer(mappackId: string, login: string | null) {
  const { data, loading } = useQuery(GET_MAPPACK_PLAYER_INFO, {
    variables: { mappackId, login: login ?? "" },
    skip: !login,
  });

  return loading ? undefined : data?.mappack.player.player;
}

export function MappackPlayerName({
  player,
}: {
  player?: { login: string; name: string };
}) {
  return player ? (
    <MPFormatLink path={`/player/${player.login}`}>{player.name}</MPFormatLink>
  ) : (
    <Skeleton className="inline-block h-6 w-48" />
  );
}

export default function MappackPlayerDetails({
  mappackId,
  login,
}: {
  mappackId: string;
  login: string | null;
}) {
  const { data, loading, error } = useQuery(GET_MAPPACK_PLAYER_INFO, {
    variables: { mappackId, login: login ?? "" },
    skip: !login,
  });
  const opened = useOpenedPanel();
  const ranks = data?.mappack.player.ranks;

  if (error) {
    return <p className="px-3 pb-2 text-destructive">{error.message}</p>;
  }

  return (
    <SubPanel className="shrink-0 bg-sunken p-3">
      <Leaderboard className="mx-0 w-full">
        <LeaderboardHeader className="[&_th]:bg-transparent">
          <LeaderboardRow>
            <LeaderboardHead className="w-24 text-right">Rank</LeaderboardHead>
            <LeaderboardHead>Map</LeaderboardHead>
          </LeaderboardRow>
        </LeaderboardHeader>

        {loading || !ranks || !opened ? (
          <TableSkeleton columns={2} rows={6} />
        ) : (
          <LeaderboardBody>
            {ranks.map((entry) => (
              <LeaderboardRow key={entry.map.gameId}>
                <RankCell>
                  {entry.rank}
                  <small>/{entry.lastRank}</small>
                </RankCell>
                <NameCell>
                  <MPFormatLink path={`/map/${entry.map.gameId}`}>
                    {entry.map.name}
                  </MPFormatLink>
                </NameCell>
              </LeaderboardRow>
            ))}
          </LeaderboardBody>
        )}
      </Leaderboard>
    </SubPanel>
  );
}
