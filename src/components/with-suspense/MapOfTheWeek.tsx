import { query } from "@/app/ApolloClient";
import { css } from "../../../@shadow-panda/styled-system/css";
import { MPFormatLink } from "../MPFormat";
import { gql } from "@/app/__generated__";
import OfTheWeek from "../ui/organisms/OfTheWeek";

const GET_MAP_OF_THE_WEEK = gql(/* GraphQL */ `
  query GetMapOfTheWeek {
    maps(first: 1) {
      nodes {
        map {
          gameId
          name
        }
      }
    }
  }
`);

export default async function MapOfTheWeek() {
  const { data } = await query({
    query: GET_MAP_OF_THE_WEEK,
  });

  return (
    <OfTheWeek
      path={`/player/${data?.maps.nodes[0].map.gameId}`}
      name={data?.maps.nodes[0].map.name ?? ""}
    />
  );
}
