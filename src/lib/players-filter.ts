import type { PlayersFilter } from "@/app/__generated__/graphql";
import type { SearchParams } from "./server-props";

export type RawPlayersFilter = {
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

function parseRawPlayersFilter(raw: SearchParams): RawPlayersFilter {
  return {
    playerLogin: parseString(raw.playerLogin),
    playerName: parseString(raw.playerName),
  };
}

export function parsePlayersFilter(
  searchParams: SearchParams,
): PlayersFilter | undefined {
  const raw = parseRawPlayersFilter(searchParams);
  return Object.values(raw).every((value) => value === undefined)
    ? undefined
    : ({
        playerLogin: raw.playerLogin,
        playerName: raw.playerName,
      } as PlayersFilter);
}
