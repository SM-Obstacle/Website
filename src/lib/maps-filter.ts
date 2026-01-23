import type { MapsFilter, RecordsFilter } from "@/app/__generated__/graphql";
import type { SearchParams } from "./server-props";

export type RawMapsFilter = {
  mapName?: string;
  mapUid?: string;
  playerLogin?: string;
  playerName?: string;
};

export function parseString(
  raw: string | string[] | undefined,
): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

export function parseArray(
  raw: string | string[] | undefined,
): string[] | undefined {
  return Array.isArray(raw) ? raw : raw === undefined ? undefined : [raw];
}

function parseRawMapsFilter(raw: SearchParams): RawMapsFilter {
  return {
    mapName: parseString(raw.mapName),
    mapUid: parseString(raw.mapUid),
    playerLogin: parseString(raw.playerLogin),
    playerName: parseString(raw.playerName),
  };
}

export function parseMapsFilter(
  searchParams: SearchParams,
): MapsFilter | undefined {
  const raw = parseRawMapsFilter(searchParams);
  return Object.values(raw).every((value) => value === undefined)
    ? undefined
    : ({
        mapName: raw.mapName,
        mapUid: raw.mapUid,
        author: (raw.playerLogin || raw.playerName) && {
          playerLogin: raw.playerLogin,
          playerName: raw.playerName,
        },
      } as MapsFilter);
}
