"use client";

import { memo } from "react";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { selectableRowProps, useRowSelection } from "@/hooks/useRowSelection";

const COLUMNS = 5;

type MappackEntry = NonNullable<MappackLbFragment["leaderboard"]>[number];

/**
 * One player's standing.
 *
 * An event edition puts hundreds of these on screen at once, and picking a row
 * only ever changes two of them. Memoised on an entry the cache hands back
 * unchanged, the rest cost nothing when the selection moves — which is what
 * keeps the panel's arrival from stuttering on a long leaderboard.
 */
const MappackRow = memo(function MappackRow({
  entry,
  nbMaps,
  selectable,
  selected,
  select,
}: {
  entry: MappackEntry;
  nbMaps: number | null | undefined;
  selectable: boolean;
  selected: boolean;
  select: (value: string) => void;
}) {
  return (
    <LeaderboardRow
      {...(selectable &&
        selectableRowProps(entry.player.login, selected, select))}
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
          <small>/{nbMaps}</small>
        </code>
      </LeaderboardCell>
      <WideOnlyCell className="text-right">
        <code>{entry.worstRank}</code>
      </WideOnlyCell>
    </LeaderboardRow>
  );
});

/**
 * Standings of a mappack — used both by event editions and by bare
 * ManiaExchange mappacks.
 *
 * When `selectable` is set, rows become selectable: the chosen player goes in
 * the query string (so the view is shareable) and whoever shows their details —
 * a dialog, a side panel — reads them back from there.
 */
export default function MappackLeaderboard({
  mappack,
  selectable = false,
}: {
  mappack: MappackLbFragment | null | undefined;
  selectable?: boolean;
}) {
  const selection = useRowSelection("player");

  const leaderboard = mappack?.leaderboard ?? [];

  return (
    <SubPanel className="min-h-0 flex-1">
      <ScrollArea className="min-h-0 flex-1">
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
                <MappackRow
                  key={entry.player.login}
                  entry={entry}
                  nbMaps={mappack?.nbMaps}
                  selectable={selectable}
                  selected={entry.player.login === selection.selected}
                  select={selection.select}
                />
              ))}
            </LeaderboardBody>
          )}
        </Leaderboard>
      </ScrollArea>
    </SubPanel>
  );
}
