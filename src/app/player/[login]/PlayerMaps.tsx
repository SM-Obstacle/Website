"use client";

import { useQuery } from "@apollo/client/react";

import { gql } from "@/app/__generated__";
import { DetailPanel } from "@/components/layout/DetailAside";
import { SubPanel } from "@/components/layout/Panel";
import { SectionLink } from "@/components/layout/SectionHeader";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import {
  Leaderboard,
  LeaderboardBody,
  LeaderboardCell,
  LeaderboardHead,
  LeaderboardHeader,
  LeaderboardRow,
  NameCell,
} from "@/components/tables/Leaderboard";
import {
  TableError,
  TableMessage,
  TableSkeleton,
} from "@/components/tables/TableStates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type PanelPlayer, playerMapsHref } from "./playerPanel";

/**
 * How many maps the panel previews. It is only a glimpse — the "See more"
 * button goes to the maps page for the rest — so there is nothing to page
 * through and nothing to filter here.
 */
const MAPS_SHOWN = 50;

const COLUMNS = 2;

const GET_PLAYER_MAPS = gql(/* GraphQL */ `
  query GetPlayerMaps($login: String!, $first: Int!) {
    maps(
      first: $first
      # Exact: this player's own maps, not those of every player whose login
      # contains this one.
      filter: { author: { playerLogin: { value: $login, exact: true } } }
      # Best rank first, which is the maps ranking from the highest score down.
      sort: { field: RANK, order: ASCENDING }
    ) {
      nodes {
        map {
          id
          gameId
          name
          score
        }
      }
    }
  }
`);

/**
 * The player's maps, from the cache once they have been fetched: the panel is
 * torn down every time a record takes it over, and putting the list back must
 * not cost another round trip.
 */
function PlayerMapsTable({ login }: { login: string }) {
  const { data, error } = useQuery(GET_PLAYER_MAPS, {
    variables: { login, first: MAPS_SHOWN },
  });

  const maps = data?.maps.nodes;

  return (
    // Narrower margins than a full-page leaderboard: this table lives in a
    // column barely wider than its own two columns.
    <Leaderboard className="mx-3 w-[calc(100%-1.5rem)]">
      <LeaderboardHeader>
        <LeaderboardRow>
          <LeaderboardHead>Map</LeaderboardHead>
          <LeaderboardHead className="w-[30%] text-right">
            Score
          </LeaderboardHead>
        </LeaderboardRow>
      </LeaderboardHeader>

      {error ? (
        <TableError columns={COLUMNS} message={error.message} />
      ) : !maps ? (
        <TableSkeleton columns={COLUMNS} rows={8} />
      ) : maps.length === 0 ? (
        <TableMessage columns={COLUMNS}>
          This player has authored no map.
        </TableMessage>
      ) : (
        <LeaderboardBody>
          {maps.map(({ map }) => (
            <LeaderboardRow key={map.id}>
              <NameCell>
                <MPFormatLink path={`/map/${map.gameId}`}>
                  {map.name}
                </MPFormatLink>
              </NameCell>
              <LeaderboardCell className="text-right">
                <code>
                  {map.score.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </code>
              </LeaderboardCell>
            </LeaderboardRow>
          ))}
        </LeaderboardBody>
      )}
    </Leaderboard>
  );
}

const SUBTITLE = "Maps they authored";

/** The player's maps beside the page, in the panel a record would otherwise have. */
export function PlayerMapsPanel({
  player,
  onClose,
}: {
  player: PanelPlayer;
  onClose: () => void;
}) {
  return (
    <DetailPanel
      title={<MPFormat>{player.name}</MPFormat>}
      subtitle={SUBTITLE}
      closeLabel="Close the list of maps"
      onClose={onClose}
      footer={
        <SectionLink href={playerMapsHref(player.login)} className="w-full" />
      }
    >
      <SubPanel className="shrink-0 bg-sunken">
        <PlayerMapsTable login={player.login} />
      </SubPanel>
    </DetailPanel>
  );
}

/** The player's maps on the layouts too narrow to keep a panel open. */
export function PlayerMapsDialog({
  player,
  open,
  onClose,
}: {
  player: PanelPlayer;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[85dvh] gap-inset overflow-y-auto rounded-block bg-popover p-inset sm:max-w-2xl">
        <DialogHeader className="px-3 pt-2">
          <DialogTitle className="truncate text-xl">
            <MPFormat>{player.name}</MPFormat>
          </DialogTitle>

          <DialogDescription asChild>
            <div className="truncate">{SUBTITLE}</div>
          </DialogDescription>
        </DialogHeader>

        {/* The list scrolls inside the dialog rather than lengthening it, so
            the button under it stays put instead of sitting fifty rows down. */}
        <SubPanel className="scrollbar-slim max-h-[55dvh] overflow-y-auto bg-sunken">
          <PlayerMapsTable login={player.login} />
        </SubPanel>

        <SectionLink
          href={playerMapsHref(player.login)}
          className="mx-3 mb-1"
        />
      </DialogContent>
    </Dialog>
  );
}
