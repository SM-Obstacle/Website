import type { GetCampaignPlayerInfoQuery } from "@/app/__generated__/graphql";
import { Medal } from "./ranked-record";
import { cmpMedals } from "./utils";

export type EventPlayer = NonNullable<
  GetCampaignPlayerInfoQuery["event"]["edition"]
>["player"];

export interface MedalCount {
  bronze: number;
  silver: number;
  gold: number;
  champion: number;
}

/** The best medal a time earns, or `null` when it beats none of them. */
function medalOf(
  time: number,
  medalTimes: { bronzeTime: number; silverTime: number; goldTime: number; championTime: number } | null | undefined,
): Medal | null {
  if (!medalTimes) return null;
  if (time <= medalTimes.championTime) return Medal.Champion;
  if (time <= medalTimes.goldTime) return Medal.Gold;
  if (time <= medalTimes.silverTime) return Medal.Silver;
  if (time <= medalTimes.bronzeTime) return Medal.Bronze;
  return null;
}

/** A set of medals is worth its weakest one. */
function weakestMedal<T extends { medal: Medal | null }>(entries: T[]) {
  return entries.reduce<Medal | null>(
    (weakest, entry) => (cmpMedals(weakest, entry.medal) >= 0 ? entry.medal : weakest),
    Medal.Champion,
  );
}

/**
 * Annotates a player's event results with the medal each time earned, the
 * medal each fully-finished category earned, and the totals.
 */
export function withMedals(data: EventPlayer) {
  const medalCount: MedalCount = {
    bronze: 0,
    silver: 0,
    gold: 0,
    champion: 0,
  };

  const categorizedRanks = data.categorizedRanks.map((category) => {
    const ranks = category.ranks.map((rank) => {
      const medal = medalOf(rank.time, rank.map.medalTimes);

      if (medal === Medal.Champion) medalCount.champion++;
      else if (medal === Medal.Gold) medalCount.gold++;
      else if (medal === Medal.Silver) medalCount.silver++;
      else if (medal === Medal.Bronze) medalCount.bronze++;

      return { ...rank, medal };
    });

    return {
      ...category,
      ranks,
      // A category only earns a medal once every one of its maps is finished.
      medal: ranks.length < category.nbMaps ? null : weakestMedal(ranks),
    };
  });

  return {
    ...data,
    categorizedRanks,
    medalCount,
    medal: weakestMedal(categorizedRanks),
    hasMedals: categorizedRanks.some((category) =>
      category.ranks.some((rank) => rank.map.medalTimes),
    ),
  };
}
