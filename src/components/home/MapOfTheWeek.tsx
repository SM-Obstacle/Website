import { Map as MapIcon } from "lucide-react";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import OfTheWeek from "./OfTheWeek";

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
    errorPolicy: "all",
  });

  const map = data?.maps.nodes[0]?.map;
  if (!map) return null;

  return (
    <OfTheWeek
      path={`/map/${map.gameId}`}
      name={map.name}
      icon={<MapIcon className="size-8 shrink-0" />}
    />
  );
}
