import { gql } from "@/app/__generated__";
import { MappackLbFragment, MappackPlayerInfoFragment, MappackPlayerInfoFragmentDoc } from "@/app/__generated__/graphql";

export const MAPPACK_LB_FRAGMENT = gql(/* GraphQL */ `
  fragment MappackLb on Mappack {
    nbMaps
    leaderboard {
      rank
      player {
        login
        name
      }
      rankAvg
      mapFinished
      worstRank
    }
  }
`);

export const MAPPACK_PLAYER_INFO_FRAGMENT = gql(/* GraphQL */ `
  fragment MappackPlayerInfo on Mappack {
    player(login: $login) {
      ranks {
        rank
        map {
          gameId
          name
        }
        lastRank
      }
    }
  }
`);

export async function fetchSelectedPlayers(
  mappackData: MappackLbFragment | undefined | null,
  selectedPlayer: string | string[],
  fetchPlayerInfo: (login: string) => Promise<MappackPlayerInfoFragment>,
) {
  // Only take the first player if it's an array
  if (Array.isArray(selectedPlayer)) {
    selectedPlayer = selectedPlayer[0];
  }

  const data = selectedPlayer && await fetchPlayerInfo(selectedPlayer);

  return {
    ...mappackData,
    leaderboard: mappackData?.leaderboard.map((row) => {
      const ranks = selectedPlayer === row.player.login && (
        data && data.player.ranks
      );
      return { ...row, ranks };
    }),
  };
}