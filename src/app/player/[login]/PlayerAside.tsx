"use client";

import {
  DetailColumn,
  WIDE_ENOUGH_FOR_A_PANEL,
} from "@/components/layout/DetailAside";
import { RecordPanel } from "@/components/records/RecordAside";
import RecordDialog from "@/components/records/RecordDialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRowSelection } from "@/hooks/useRowSelection";
import { useUrlParams } from "@/hooks/useUrlParams";
import { PlayerMapsDialog, PlayerMapsPanel } from "./PlayerMaps";
import {
  type PanelPlayer,
  PLAYER_MAPS_PARAM,
  RECORD_SELECTION,
} from "./playerPanel";

/**
 * What the panel is showing, as the one string `DetailColumn` holds on to
 * while it slides back out. A record wins over the list of maps, which only
 * happens on a hand-written URL: picking either one clears the other.
 */
const MAPS_VIEW = "maps";
const RECORD_VIEW = "record:";

/**
 * The player page's side panel: the record a row picked, or the maps this
 * player authored. Both are the same column, so asking for one while the other
 * is up swaps what it holds rather than opening anything.
 */
export default function PlayerAside({ player }: { player: PanelPlayer }) {
  const selection = useRowSelection("record", RECORD_SELECTION);
  const { searchParams } = useUrlParams();
  const wide = useMediaQuery(WIDE_ENOUGH_FOR_A_PANEL);

  const maps =
    selection.selected === null &&
    searchParams.get(PLAYER_MAPS_PARAM) === "1";

  if (!wide) {
    return (
      <>
        <RecordDialog recordId={selection.selected} onClose={selection.close} />
        <PlayerMapsDialog
          player={player}
          open={maps}
          onClose={selection.close}
        />
      </>
    );
  }

  return (
    <DetailColumn
      selected={
        maps
          ? MAPS_VIEW
          : selection.selected && `${RECORD_VIEW}${selection.selected}`
      }
    >
      {(view) =>
        view === MAPS_VIEW ? (
          <PlayerMapsPanel player={player} onClose={selection.close} />
        ) : (
          <RecordPanel
            recordId={view?.slice(RECORD_VIEW.length) ?? null}
            onClose={selection.close}
          />
        )
      }
    </DetailColumn>
  );
}
