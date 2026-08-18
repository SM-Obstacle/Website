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
} from "@/components/tables/Leaderboard";
import { TableSkeleton } from "@/components/tables/TableStates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GET_MAPPACK_PLAYER_INFO = gql(/* GraphQL */ `
  query GetMappackPlayerInfo($mappackId: String!, $login: String!) {
    mappack(mappackId: $mappackId) {
      ...MappackPlayerInfo
    }
  }
`);

export default function MappackPlayerDialog({
  mappackId,
  mappackName,
  login,
  onClose,
}: {
  mappackId: string;
  mappackName: string;
  login: string | null;
  onClose: () => void;
}) {
  const { data, loading, error } = useQuery(GET_MAPPACK_PLAYER_INFO, {
    variables: { mappackId, login: login ?? "" },
    skip: !login,
  });

  const ranks = data?.mappack.player.ranks;

  return (
    <Dialog open={login !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85dvh] gap-inset overflow-y-auto rounded-block bg-popover p-inset sm:max-w-2xl">
        <DialogHeader className="px-3 pt-2">
          <DialogTitle className="truncate text-xl">
            {login && (
              <MPFormatLink path={`/player/${login}`}>{login}</MPFormatLink>
            )}
          </DialogTitle>
          <DialogDescription>on {mappackName}</DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="px-3 pb-2 text-destructive">{error.message}</p>
        ) : (
          <SubPanel className="bg-sunken p-3">
            <Leaderboard className="mx-0 w-full">
              <LeaderboardHeader className="[&_th]:bg-transparent">
                <LeaderboardRow>
                  <LeaderboardHead className="w-24 text-right">
                    Rank
                  </LeaderboardHead>
                  <LeaderboardHead>Map</LeaderboardHead>
                </LeaderboardRow>
              </LeaderboardHeader>

              {loading || !ranks ? (
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
        )}
      </DialogContent>
    </Dialog>
  );
}
