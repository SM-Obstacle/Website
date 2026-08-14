import type {
  MapsFilter,
  PlayersFilter,
  RecordsFilter,
} from "@/app/__generated__/graphql";

/**
 * Anything that can be read like a `URLSearchParams`: the real thing on the
 * client, or Next's `ReadonlyURLSearchParams`.
 */
export type ReadableParams = Pick<URLSearchParams, "get">;

export const PLAYER_FILTER_KEYS = ["playerLogin", "playerName"] as const;
export const MAP_FILTER_KEYS = ["mapUid", "mapName"] as const;
export const RECORD_FILTER_KEYS = [
  "beforeDate",
  "afterDate",
  "timeGt",
  "timeLt",
] as const;

export const RECORDS_FILTER_KEYS = [
  ...PLAYER_FILTER_KEYS,
  ...MAP_FILTER_KEYS,
  ...RECORD_FILTER_KEYS,
] as const;
export const PLAYERS_FILTER_KEYS = PLAYER_FILTER_KEYS;
export const MAPS_FILTER_KEYS = [
  ...MAP_FILTER_KEYS,
  ...PLAYER_FILTER_KEYS,
] as const;

function text(params: ReadableParams, key: string): string | undefined {
  return params.get(key)?.trim() || undefined;
}

function number(params: ReadableParams, key: string): number | undefined {
  const raw = text(params, key);
  if (raw === undefined) return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/** `undefined` when every field is empty, so we don't send a no-op filter. */
function orUndefined<T extends object>(filter: T): T | undefined {
  return Object.values(filter).some((value) => value !== undefined)
    ? filter
    : undefined;
}

export function buildPlayersFilter(
  params: ReadableParams,
): PlayersFilter | undefined {
  return orUndefined({
    playerLogin: text(params, "playerLogin"),
    playerName: text(params, "playerName"),
  });
}

export function buildMapsFilter(
  params: ReadableParams,
): MapsFilter | undefined {
  return orUndefined({
    mapUid: text(params, "mapUid"),
    mapName: text(params, "mapName"),
    author: buildPlayersFilter(params),
  });
}

export function buildRecordsFilter(
  params: ReadableParams,
): RecordsFilter | undefined {
  return orUndefined({
    player: buildPlayersFilter(params),
    map: orUndefined({
      mapUid: text(params, "mapUid"),
      mapName: text(params, "mapName"),
    }),
    beforeDate: text(params, "beforeDate"),
    afterDate: text(params, "afterDate"),
    timeGt: number(params, "timeGt"),
    timeLt: number(params, "timeLt"),
  });
}

export function countActiveFilters(
  params: ReadableParams,
  keys: readonly string[],
): number {
  return keys.filter((key) => text(params, key) !== undefined).length;
}
