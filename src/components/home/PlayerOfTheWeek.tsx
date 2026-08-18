import { User } from "lucide-react";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import OfTheWeek from "./OfTheWeek";
import catchGqlError from "@/lib/catchError";

const GET_PLAYER_OF_THE_WEEK = gql(/* GraphQL */ `
  query GetPlayerOfTheWeek {
    players(first: 1) {
      nodes {
        player {
          login
          name
        }
      }
    }
  }
`);

export default async function PlayerOfTheWeek() {
  const { data } = await query({
    query: GET_PLAYER_OF_THE_WEEK,
  }).catch(catchGqlError);

  const player = data?.players.nodes[0]?.player;
  if (!player) return null;

  return (
    <OfTheWeek
      path={`/player/${player.login}`}
      name={player.name}
      icon={<User className="size-8 shrink-0" />}
    />
  );
}
