import { gql } from "@/app/__generated__";

export const MAPPACK_LB_FRAGMENT = gql(/* GraphQL */ `
  fragment MappackLb on Mappack {
    nextUpdateIn
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
