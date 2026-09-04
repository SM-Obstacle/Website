import type {
  MapsFilter,
  PlayersFilter,
  RecordsFilter,
  StringFilter,
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

/** The param a text field's "exact match" checkbox writes to. */
export function exactKey(key: string): string {
  return `${key}Exact`;
}

/**
 * A string comparison, exact when the field's companion `<key>Exact` param is
 * set. Exact means the whole value, case-sensitively; otherwise the value is
 * looked for anywhere in the column.
 */
function string(
  params: ReadableParams,
  key: string,
): StringFilter | undefined {
  const value = text(params, key);
  if (value === undefined) return undefined;
  return { value, exact: params.get(exactKey(key)) === "1" };
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
    playerLogin: string(params, "playerLogin"),
    playerName: string(params, "playerName"),
  });
}

export function buildMapsFilter(
  params: ReadableParams,
): MapsFilter | undefined {
  return orUndefined({
    mapUid: string(params, "mapUid"),
    mapName: string(params, "mapName"),
    author: buildPlayersFilter(params),
  });
}

export function buildRecordsFilter(
  params: ReadableParams,
): RecordsFilter | undefined {
  return orUndefined({
    player: buildPlayersFilter(params),
    map: orUndefined({
      mapUid: string(params, "mapUid"),
      mapName: string(params, "mapName"),
      author: orUndefined({
        playerLogin: string(params, "mapAuthorLogin"),
        playerName: string(params, "mapAuthorName"),
      }),
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
