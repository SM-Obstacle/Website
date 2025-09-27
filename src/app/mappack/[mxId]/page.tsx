import moment from "moment";
import { gql } from "@/app/__generated__";
import type {
  MappackLbFragment,
  MappackPlayerInfoFragment,
} from "@/app/__generated__/graphql";
import { query } from "@/app/ApolloClient";
import { CampaignHeader, CampaignTable } from "@/components/CampaignMain";
import { fetchSelectedPlayers } from "@/lib/mappack-fragments";
import type { ServerProps } from "@/lib/server-props";

const GET_MAPPACK_LEADERBOARD = gql(/* GraphQL */ `
  query GetMappackLeaderboard($mappackId: String!) {
    mappack(mappackId: $mappackId) {
      mxAuthor
      mxCreatedAt
      mxName
      ...MappackLb
    }
  }
`);

const GET_MAPPACK_PLAYER_INFO = gql(/* GraphQL */ `
  query GetMappackPlayerInfo($mappackId: String!, $login: String!) {
    mappack(mappackId: $mappackId) {
      ...MappackPlayerInfo
    }
  }
`);

async function fetchPlayers(
  mappackId: string,
  mappackData: MappackLbFragment | undefined | null,
  selectedPlayer: string | string[],
) {
  const fetchPlayerInfo = async (login: string) => {
    return query({
      query: GET_MAPPACK_PLAYER_INFO,
      variables: {
        login,
        mappackId,
      },
      errorPolicy: "all",
    }).then((data) => data.data?.mappack);
  };

  return fetchSelectedPlayers(
    mappackData,
    selectedPlayer,
    fetchPlayerInfo as (login: string) => Promise<MappackPlayerInfoFragment>,
  );
}

type SP = ServerProps<
  {
    mxId: string;
  },
  { player?: string | string[] }
>;

export default async function Mappack(props: SP) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { data: mappackLbData, error } = await query({
    query: GET_MAPPACK_LEADERBOARD,
    variables: { mappackId: params.mxId },
    errorPolicy: "all",
  });

  const mappack = mappackLbData?.mappack;
  const data = await fetchPlayers(
    params.mxId,
    mappack,
    searchParams.player ?? [],
  );

  const startDate = moment(mappack?.mxCreatedAt).format("DD/MM/YYYY");

  return error ? (
    error.message
  ) : (
    <>
      <CampaignHeader
        bannerImgUrl={null}
        title={mappack?.mxName ?? ""}
        startDate={startDate}
        authors={mappack?.mxAuthor && <span>By {mappack.mxAuthor}</span>}
      />

      <CampaignTable data={data} nbMaps={mappack?.nbMaps ?? 0} />
    </>
  );
}
