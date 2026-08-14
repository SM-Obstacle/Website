"use client";

import type { MappackLbFragment } from "@/app/__generated__/graphql";
import { SubPanel } from "@/components/layout/Panel";
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
  WideOnlyCell,
  WideOnlyHead,
} from "@/components/tables/Leaderboard";
import { TableMessage } from "@/components/tables/TableStates";
import { useUrlParams } from "@/hooks/useUrlParams";
import { cn } from "@/lib/utils";

const COLUMNS = 5;

/**
 * Standings of a mappack — used both by event editions and by bare
 * ManiaExchange mappacks.
 *
 * When `renderSelected` is given, rows become selectable: the chosen player
 * goes in the query string (so the view is shareable) and the caller renders
 * their details, typically in a dialog.
 */
export default function MappackLeaderboard({
  mappack,
  renderSelected,
}: {
  mappack: MappackLbFragment | null | undefined;
  renderSelected?: (
    login: string | null,
    close: () => void,
  ) => React.ReactNode;
}) {
  const { searchParams, setParams } = useUrlParams();
  const selected = searchParams.get("player");
  const selectable = renderSelected !== undefined;

  const select = (login: string) =>
    setParams({ player: login === selected ? undefined : login });

  const leaderboard = mappack?.leaderboard ?? [];

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
              <LeaderboardHead className="w-[15%] text-right">
                <span className="hidden xl:inline">Rank </span>Average
              </LeaderboardHead>
              <LeaderboardHead className="w-[15%] text-right">
                <span className="hidden xl:inline">Maps </span>Finished
              </LeaderboardHead>
              <WideOnlyHead className="w-[15%] text-right">
                Worst<span className="hidden xl:inline"> Rank</span>
              </WideOnlyHead>
            </LeaderboardRow>
          </LeaderboardHeader>

          {leaderboard.length === 0 ? (
            <TableMessage columns={COLUMNS}>
              Nobody has played this mappack yet.
            </TableMessage>
          ) : (
            <LeaderboardBody>
              {leaderboard.map((entry) => (
                <LeaderboardRow
                  key={entry.player.login}
                  {...(selectable && {
                    tabIndex: 0,
                    onClick: () => select(entry.player.login),
                    onKeyDown: (event: React.KeyboardEvent) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        select(entry.player.login);
                      }
                    },
                  })}
                  data-state={
                    entry.player.login === selected ? "selected" : undefined
                  }
                  className={cn(
                    selectable && "cursor-pointer",
                    "data-[state=selected]:[&>td]:bg-white/20",
                  )}
                >
                  <RankCell>{entry.rank}</RankCell>
                  <NameCell>
                    <MPFormatLink
                      component={NoPropagationLink}
                      path={`/player/${entry.player.login}`}
                    >
                      {entry.player.name}
                    </MPFormatLink>
                  </NameCell>
                  <LeaderboardCell className="text-right">
                    <code>{entry.rankAvg}</code>
                  </LeaderboardCell>
                  <LeaderboardCell className="text-right">
                    <code>
                      {entry.mapFinished}
                      <small>/{mappack?.nbMaps}</small>
                    </code>
                  </LeaderboardCell>
                  <WideOnlyCell className="text-right">
                    <code>{entry.worstRank}</code>
                  </WideOnlyCell>
                </LeaderboardRow>
              ))}
            </LeaderboardBody>
          )}
        </Leaderboard>
      </SubPanel>

      {renderSelected?.(selected, () => setParams({ player: undefined }))}
    </>
  );
}
