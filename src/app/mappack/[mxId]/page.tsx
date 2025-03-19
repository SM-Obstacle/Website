import { gql } from "@/app/__generated__";
import { MappackLbFragment } from "@/app/__generated__/graphql";
import { CampaignHeader, CampaignTable } from "@/components/CampaignMain";
import { fetchSelectedPlayers } from "@/lib/mappack-fragments";
import { ServerProps } from "@/lib/server-props";
import { fetchGraphql } from "@/lib/utils";
import moment from "moment";
import React from "react";

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
    return fetchGraphql(GET_MAPPACK_PLAYER_INFO, {
      login,
      mappackId
    }).then((data) => data.mappack);
  };

  return fetchSelectedPlayers(mappackData, selectedPlayer, fetchPlayerInfo as any);
}

type SP = ServerProps<{
  mxId: string,
}, { player?: string | string[] }
>;

export default async function Mappack(props: SP) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const mappack = (await fetchGraphql(GET_MAPPACK_LEADERBOARD, {
    mappackId: params.mxId,
  })).mappack;
  const data = await fetchPlayers(params.mxId, mappack, searchParams.player ?? []);

  const startDate = moment(mappack.mxCreatedAt).format("DD/MM/YYYY");

  return (
    <>
      <CampaignHeader
        bannerImgUrl={null}
        title={mappack.mxName!}
        startDate={startDate}
        authors={mappack.mxAuthor && (
          <span>By {mappack.mxAuthor}</span>
        )}
      />

      <CampaignTable data={data} nbMaps={mappack!.nbMaps} />
    </>
  );
}