"use client";

import { useQuery } from "@apollo/client/react";
import { ChevronDown, Circle } from "lucide-react";

import { gql } from "@/app/__generated__";
import { SubPanel } from "@/components/layout/Panel";
import { MedalImg } from "@/components/MedalImg";
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
} from "@/components/tables/Leaderboard";
import { TableSkeleton } from "@/components/tables/TableStates";
import Time from "@/components/Time";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { withMedals } from "@/lib/event-medals";
import { Medal } from "@/lib/ranked-record";

const GET_CAMPAIGN_PLAYER_INFO = gql(/* GraphQL */ `
  query GetCampaignPlayerInfo(
    $eventHandle: String!
    $editionId: Int!
    $login: String!
  ) {
    event(handle: $eventHandle) {
      edition(editionId: $editionId) {
        player(login: $login) {
          player {
            login
            name
            zonePath
            role
          }
          rank
          rankAvg
          mapFinished
          worstRank
          categorizedRanks {
            categoryName
            bannerImgUrl
            hexColor
            nbMaps
            ranks {
              rank
              time
              map {
                map {
                  gameId
                  name
                }
                lastRank
                medalTimes {
                  bronzeTime
                  silverTime
                  goldTime
                  championTime
                }
              }
            }
          }
          unfinishedMaps {
            map {
              gameId
              name
            }
            lastRank
          }
        }
      }
    }
  }
`);

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <code className="text-lg font-bold">{value}</code>
    </div>
  );
}

function MapGroup({
  title,
  medal,
  children,
}: React.PropsWithChildren<{ title: React.ReactNode; medal?: React.ReactNode }>) {
  return (
    <Collapsible defaultOpen className="rounded-panel bg-black/40 py-1">
      <CollapsibleTrigger className="group flex w-full items-center gap-2 px-4 py-2 text-left font-bold">
        {title}
        <span className="ms-auto flex items-center gap-2">
          {medal}
          <ChevronDown className="size-4 transition-transform group-data-[state=closed]:-rotate-90" />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 pb-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export default function EventPlayerDialog({
  eventHandle,
  editionId,
  eventName,
  login,
  onClose,
}: {
  eventHandle: string;
  editionId: number;
  eventName: string;
  login: string | null;
  onClose: () => void;
}) {
  const { data, loading, error } = useQuery(GET_CAMPAIGN_PLAYER_INFO, {
    variables: { eventHandle, editionId, login: login ?? "" },
    skip: !login,
  });

  const raw = data?.event.edition?.player;
  const player = raw ? withMedals(raw) : undefined;

  return (
    <Dialog open={login !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85dvh] gap-inset overflow-y-auto rounded-block bg-popover p-inset sm:max-w-3xl">
        <DialogHeader className="px-3 pt-2">
          <DialogTitle className="truncate text-xl">
            {player ? (
              <MPFormatLink path={`/player/${player.player.login}`}>
                {player.player.name}
              </MPFormatLink>
            ) : (
              login
            )}
          </DialogTitle>
          <DialogDescription>on {eventName}</DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="px-3 pb-2 text-destructive">{error.message}</p>
        ) : loading || !player ? (
          <SubPanel className="p-3">
            <Leaderboard className="mx-0 w-full">
              <TableSkeleton columns={3} rows={6} />
            </Leaderboard>
          </SubPanel>
        ) : (
          <>
            <SubPanel className="gap-3 bg-black/40 p-3">
              <div className="flex justify-around">
                <Stat label="Rank" value={player.rank} />
                <Stat label="Rank average" value={player.rankAvg} />
                <Stat
                  label="Maps finished"
                  value={
                    <>
                      {player.mapFinished}
                      <small>
                        /{player.mapFinished + player.unfinishedMaps.length}
                      </small>
                    </>
                  }
                />
                <Stat label="Worst rank" value={player.worstRank} />
              </div>

              {player.hasMedals && (
                <>
                  <Separator />
                  <div className="flex justify-center gap-8">
                    {(
                      [
                        [Medal.Bronze, player.medalCount.bronze],
                        [Medal.Silver, player.medalCount.silver],
                        [Medal.Gold, player.medalCount.gold],
                        [Medal.Champion, player.medalCount.champion],
                      ] as const
                    ).map(([medal, count]) => (
                      <span key={medal} className="flex items-center gap-2">
                        {count} <MedalImg mdl={medal} />
                      </span>
                    ))}
                  </div>
                </>
              )}
            </SubPanel>

            {player.unfinishedMaps.length > 0 && (
              <MapGroup title="Unfinished maps">
                <Leaderboard className="mx-0 w-full">
                  <LeaderboardHeader className="[&_th]:bg-transparent">
                    <LeaderboardRow>
                      <LeaderboardHead>Map</LeaderboardHead>
                      <LeaderboardHead className="w-32 text-right">
                        Last rank
                      </LeaderboardHead>
                    </LeaderboardRow>
                  </LeaderboardHeader>
                  <LeaderboardBody>
                    {player.unfinishedMaps.map((entry) => (
                      <LeaderboardRow key={entry.map.gameId}>
                        <NameCell>
                          <MPFormatLink
                            path={`/event/${eventHandle}/${editionId}/map/${entry.map.gameId}`}
                          >
                            {entry.map.name}
                          </MPFormatLink>
                        </NameCell>
                        <RankCell>
                          {entry.lastRank > 0 ? entry.lastRank : "—"}
                        </RankCell>
                      </LeaderboardRow>
                    ))}
                  </LeaderboardBody>
                </Leaderboard>
              </MapGroup>
            )}

            {player.categorizedRanks.map(
              (category) =>
                category.ranks.length > 0 && (
                  <MapGroup
                    key={category.categoryName}
                    medal={<MedalImg mdl={category.medal} />}
                    title={
                      <span className="flex items-center gap-2">
                        {category.hexColor && (
                          <Circle
                            className="size-3"
                            fill={`#${category.hexColor}`}
                            stroke="none"
                          />
                        )}
                        {category.categoryName}
                        {category.nbMaps > 0 && (
                          <Badge variant="secondary">
                            {category.ranks.length}/{category.nbMaps}
                          </Badge>
                        )}
                      </span>
                    }
                  >
                    <Leaderboard className="mx-0 w-full">
                      <LeaderboardHeader className="[&_th]:bg-transparent">
                        <LeaderboardRow>
                          <LeaderboardHead className="w-20 text-right">
                            Rank
                          </LeaderboardHead>
                          <LeaderboardHead>Map</LeaderboardHead>
                          <LeaderboardHead className="w-32">
                            Time
                          </LeaderboardHead>
                          <LeaderboardHead className="w-16 text-right">
                            Medal
                          </LeaderboardHead>
                        </LeaderboardRow>
                      </LeaderboardHeader>
                      <LeaderboardBody>
                        {category.ranks.map((rank) => (
                          <LeaderboardRow key={rank.map.map.gameId}>
                            <RankCell>
                              {rank.rank}
                              <small>/{rank.map.lastRank}</small>
                            </RankCell>
                            <NameCell>
                              <MPFormatLink
                                path={`/event/${eventHandle}/${editionId}/map/${rank.map.map.gameId}`}
                              >
                                {rank.map.map.name}
                              </MPFormatLink>
                            </NameCell>
                            <TimeCell>
                              <Time>{rank.time}</Time>
                            </TimeCell>
                            <NameCell className="flex justify-end">
                              <MedalImg mdl={rank.medal} />
                            </NameCell>
                          </LeaderboardRow>
                        ))}
                      </LeaderboardBody>
                    </Leaderboard>
                  </MapGroup>
                ),
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
