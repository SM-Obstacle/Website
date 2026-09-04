import { exactKey } from "@/lib/filters";

/**
 * The query-string flag that puts the player's own maps in the detail panel.
 *
 * The panel is the one a picked record uses too, so the two params are kept
 * mutually exclusive: whichever was asked for last is the one showing.
 */
export const PLAYER_MAPS_PARAM = "maps";

/** What a record selection on this page has to clear to take the panel over. */
export const RECORD_SELECTION = { clears: [PLAYER_MAPS_PARAM] };

/** The maps page, narrowed to the maps this player authored. */
export function playerMapsHref(login: string) {
  // Exact: this player's own maps, not those of every player whose login
  // contains this one.
  return `/maps?playerLogin=${encodeURIComponent(login)}&${exactKey(
    "playerLogin",
  )}=1`;
}

/** Just enough of a player to head the panel and query their maps. */
export type PanelPlayer = {
  login: string;
  name: string;
};
