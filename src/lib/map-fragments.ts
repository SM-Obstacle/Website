import { gql } from "@/app/__generated__";

/**
 * Everything the header of a map page shows, wherever that map is being looked
 * at from — the map itself, or the copy an event edition keeps of it.
 */
export const MAP_INFO_FRAGMENT = gql(/* GraphQL */ `
  fragment MapInfo on Map {
    gameId
    mxId
    mxIdStatus
    name
    cpsNumber
    player {
      login
      name
    }
    relatedEventEditions {
      map {
        gameId
      }
      redirectToEvent
      edition {
        id
        name
        subtitle
        event {
          handle
        }
      }
    }
  }
`);

/** One page of a map's leaderboard, whichever field it was read from. */
export const MAP_RECORDS_FRAGMENT = gql(/* GraphQL */ `
  fragment MapRecords on RankedRecordConnection {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    nodes {
      player {
        login
        name
      }
      ...RecordBase
    }
  }
`);
