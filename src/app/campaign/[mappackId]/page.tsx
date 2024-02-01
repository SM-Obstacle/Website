import { gql } from "@/app/__generated__";
import { MPFormatLink } from "@/components/MPFormat";
import { fetchGraphql } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";
import CampaignPlayerRow from "./CampaignPlayerRow";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GetCampaignLeaderboardQuery, GetCampaignPlayerInfoQuery } from "@/app/__generated__/graphql";
import { SearchParams, ServerProps } from "@/lib/server-props";

export const GET_CAMPAIGN_LEADERBOARD = gql(/* GraphQL */ `
  query GetCampaignLeaderboard($mappackId: String!) {
    mappack(mappackId: $mappackId) {
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
  }
`);

export const GET_CAMPAIGN_PLAYER_INFO = gql(/* GraphQL */ `
  query GetCampaignPlayerInfo($mappackId: String!, $login: String!) {
    mappack(mappackId: $mappackId) {
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
  }
`);

type SP = ServerProps<{ mappackId: string }, { player?: string | string[] }>;

export async function generateMetadata(
  { params }: SP,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const oldTitle = (await parent).title?.absolute;

  return {
    title: `${oldTitle} - Campaign ${params.mappackId}`,
  };
}

async function fetchSelectedPlayers(
  mappackId: string,
  mappackData: GetCampaignLeaderboardQuery["mappack"],
  selectedPlayer: string | string[]
) {
  // Only take the first player if it's an array
  if (typeof selectedPlayer === "object") {
    selectedPlayer = selectedPlayer[0];
  }

  let data: GetCampaignPlayerInfoQuery | null = null;
  if (selectedPlayer) {
    data = await fetchGraphql(GET_CAMPAIGN_PLAYER_INFO, {
      mappackId,
      login: selectedPlayer,
    });
  }

  return {
    ...mappackData,
    leaderboard: mappackData.leaderboard.map((row) => {
      let ranks = null;
      if (selectedPlayer === row.player.login) {
        ranks = data?.mappack.player.ranks;
      }
      return { ...row, ranks };
    }),
  }
}

export default async function Campaign({
  params,
  searchParams,
}: SP) {
  const mappack = (await fetchGraphql(GET_CAMPAIGN_LEADERBOARD, { mappackId: params.mappackId })).mappack;
  const data = await fetchSelectedPlayers(params.mappackId, mappack, searchParams.player ?? []);

  return (
    <table>
      <thead>
        <tr>
          <th className="rank">
            <span>Rank</span>
          </th>
          <th className="sr_player">
            <span>Player</span>
          </th>
          <th className="rank_avg">
            <span>Rank </span>
            <span>Average</span>
          </th>
          <th className="map_finished">
            <span>Map </span>
            <span>Finished</span>
          </th>
          <th className="worst_rank">
            <span>Worst </span>
            <span>Rank</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.leaderboard.map((player, i) => (
          <React.Fragment key={i}>
            <CampaignPlayerRow unfold={player.ranks !== null} login={player.player.login}>
              <td className="rank">{player.rank}</td>
              <td className="sr_player">
                <MPFormatLink
                  path={`/player/${player.player.login}`}
                  name={player.player.name}
                />
              </td>
              <td className="rank_avg">{player.rankAvg}</td>
              <td className="map_finished">
                <span>
                  {player.mapFinished}
                  <small>/{mappack.nbMaps}</small>
                </span>
              </td>
              <td className="worst_rank">{player.worstRank}</td>
            </CampaignPlayerRow>
            {player.ranks?.map((rank) => (
              <tr key={rank.map.gameId} className="additional">
                <td className="rank">
                  <span style={rank.rank > rank.lastRank ? { color: "#adadadcc" } : undefined}>
                    {rank.rank}
                    <small>/{rank.lastRank}</small>
                  </span>
                </td>
                <td className="sr_player">
                  <MPFormatLink
                    path={`/map/${rank.map.gameId}`}
                    name={rank.map.name}
                  />
                </td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

