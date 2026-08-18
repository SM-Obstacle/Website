"use client";

import { useQuery } from "@apollo/client/react";
import { ChevronDown, Circle } from "lucide-react";

import { gql } from "@/app/__generated__";
import { SubPanel } from "@/components/layout/Panel";
import { MedalImg } from "@/components/MedalImg";
import { MPFormatLink } from "@/components/MPFormat";
import Stat from "@/components/Stat";
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

export type SelectedEventPlayer = ReturnType<typeof withMedals>;

export interface EventPlayerRef {
  eventHandle: string;
  editionId: number;
  login: string | null;
}

/**
 * The player a leaderboard row selected, shown either in a dialog or in the
 * side panel. The login comes from the query string, so an unknown one has to
 * be tolerated: the query then simply comes back empty.
 */
export function useSelectedEventPlayer({
  eventHandle,
  editionId,
  login,
}: EventPlayerRef) {
  const { data, loading, error } = useQuery(GET_CAMPAIGN_PLAYER_INFO, {
    variables: { eventHandle, editionId, login: login ?? "" },
    skip: !login,
  });

  // While a new player loads, `data` still holds the previous one.
  const raw = loading ? undefined : data?.event.edition?.player;

  return {
    selected: login !== null,
    error,
    player: raw ? withMedals(raw) : undefined,
  };
}

/** The player's own name, falling back to the login until it has loaded. */
export function EventPlayerName({
  player,
  login,
}: {
  player?: SelectedEventPlayer;
  login: string | null;
}) {
  return player ? (
    <MPFormatLink path={`/player/${player.player.login}`}>
      {player.player.name}
    </MPFormatLink>
  ) : (
    login
  );
}

function MapGroup({
  title,
  medal,
  children,
}: React.PropsWithChildren<{ title: React.ReactNode; medal?: React.ReactNode }>) {
  return (
    <Collapsible defaultOpen className="shrink-0 rounded-panel bg-sunken py-1">
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

/** Everything below the player's own name: what both presentations share. */
export default function EventPlayerDetails({
  eventHandle,
  editionId,
  player,
  error,
}: {
  eventHandle: string;
  editionId: number;
  player?: SelectedEventPlayer;
  error?: { message: string };
}) {
  if (error) {
    return <p className="px-3 pb-2 text-destructive">{error.message}</p>;
  }

  if (!player) {
    return (
      <SubPanel className="shrink-0 p-3">
        <Leaderboard className="mx-0 w-full">
          <TableSkeleton columns={3} rows={6} />
        </Leaderboard>
      </SubPanel>
    );
  }

  return (
    // Sized against the container, not the window: the same figures and columns
    // spread out inside the dialog and tighten up inside the side panel, which
    // is narrow on the very screens the window query would call wide.
    <div className="@container flex shrink-0 flex-col gap-inset">
      <SubPanel className="shrink-0 gap-3 bg-sunken p-3">
        <div className="grid grid-cols-2 gap-3 @md:flex @md:justify-around">
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
            <div className="flex flex-wrap justify-center gap-4 @md:gap-8">
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
                <LeaderboardHead className="w-20 text-right @md:w-32">
                  Last<span className="hidden @md:inline"> rank</span>
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
                <span className="flex min-w-0 items-center gap-2">
                  {category.hexColor && (
                    <Circle
                      className="size-3 shrink-0"
                      fill={`#${category.hexColor}`}
                      stroke="none"
                    />
                  )}
                  <span className="truncate">{category.categoryName}</span>
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
                    <LeaderboardHead className="w-14 text-right @md:w-20">
                      Rank
                    </LeaderboardHead>
                    <LeaderboardHead>Map</LeaderboardHead>
                    <LeaderboardHead className="w-20 @md:w-32">
                      Time
                    </LeaderboardHead>
                    <LeaderboardHead className="w-10 text-right @md:w-16">
                      {/* The medals speak for themselves once the column is
                          too narrow to name them without spilling over. */}
                      <span className="sr-only @md:not-sr-only">Medal</span>
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
    </div>
  );
}
