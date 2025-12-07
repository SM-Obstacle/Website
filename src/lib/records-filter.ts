import type { RecordsFilter } from "@/app/__generated__/graphql";
import type { SearchParams } from "./server-props";

export type RawRecordsFilter = {
  afterDate?: string;
  beforeDate?: string;
  mapName?: string;
  mapUid?: string;
  playerLogin?: string;
  playerName?: string;
  timeGt?: string;
  timeLt?: string;
};

function parseNumber(raw: string | undefined): number | undefined {
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

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

function parseRawRecordsFilter(raw: SearchParams): RawRecordsFilter {
  return {
    afterDate: parseString(raw.afterDate),
    beforeDate: parseString(raw.beforeDate),
    mapName: parseString(raw.mapName),
    mapUid: parseString(raw.mapUid),
    playerLogin: parseString(raw.playerLogin),
    playerName: parseString(raw.playerName),
    timeGt: parseString(raw.timeGt),
    timeLt: parseString(raw.timeLt),
  };
}

export function parseRecordsFilter(
  searchParams: SearchParams,
): RecordsFilter | undefined {
  const raw = parseRawRecordsFilter(searchParams);
  return Object.values(raw).every((value) => value === undefined)
    ? undefined
    : ({
        afterDate: raw.afterDate,
        beforeDate: raw.beforeDate,
        map: {
          mapName: raw.mapName,
          mapUid: raw.mapUid,
        },
        player: {
          playerLogin: raw.playerLogin,
          playerName: raw.playerName,
        },
        timeGt: parseNumber(raw.timeGt),
        timeLt: parseNumber(raw.timeLt),
      } as RecordsFilter);
}
