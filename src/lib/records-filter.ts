import type { RecordsFilter } from "@/app/__generated__/graphql";

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

export function parseRecordsFilter(raw: RawRecordsFilter): RecordsFilter {
  return {
    afterDate: raw.afterDate,
    beforeDate: raw.beforeDate,
    mapName: raw.mapName,
    mapUid: raw.mapUid,
    playerLogin: raw.playerLogin,
    playerName: raw.playerName,
    timeGt: parseNumber(raw.timeGt),
    timeLt: parseNumber(raw.timeLt),
  } as RecordsFilter;
}
