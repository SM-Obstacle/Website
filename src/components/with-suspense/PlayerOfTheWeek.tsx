import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import OfTheWeek from "../ui/organisms/OfTheWeek";

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
  });

  return (
    <OfTheWeek
      path={`/player/${data?.players.nodes[0].player.login}`}
      name={data?.players.nodes[0].player.name ?? ""}
    />
  );
}
