import { gql } from "@/app/__generated__";
import { MPFormatLink } from "@/components/MPFormat";
import { fetchGraphql } from "@/lib/utils";
import { Metadata } from "next";
import React, { CSSProperties } from "react";
import CampaignPlayerRow from "./CampaignPlayerRow";
import { ServerProps } from "@/lib/server-props";
import { GetCampaignLeaderboardQuery } from "@/app/__generated__/graphql";
import NoPropagationLink from "@/components/NoPropagationLink";
import moment from "moment";

const GET_CAMPAIGN_LEADERBOARD = gql(/* GraphQL */ `
  query GetCampaignLeaderboard($eventHandle: String!, $editionId: Int!) {
    event(handle: $eventHandle) {
      admins {
        login
        name
      }
      edition(editionId: $editionId) {
        name
        startDate
        bannerImgUrl
        admins {
          login
          name
        }
        mappack {
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
    }
  }
`);

const GET_CAMPAIGN_PLAYER_INFO = gql(/* GraphQL */ `
  query GetCampaignPlayerInfo($eventHandle: String!, $editionId: Int!, $login: String!) {
    event(handle: $eventHandle) {
      edition(editionId: $editionId) {
        mappack {
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
    }
  }
`);

type SP = ServerProps<
  {
    eventHandle: string;
    editionId: string;
  },
  { player?: string | string[] }
>;

// TODO: retrieve the title from the event
export async function generateMetadata(
  { params: { editionId: rawEditionId, eventHandle } }: SP,
): Promise<Metadata> {
  const editionId = parseInt(rawEditionId);
  const event = (await fetchGraphql(GET_CAMPAIGN_LEADERBOARD, {
    eventHandle,
    editionId,
  })).event;

  return {
    title: event.edition.name,
  };
}

async function fetchSelectedPlayers(
  eventHandle: string,
  editionId: number,
  mappackData: GetCampaignLeaderboardQuery["event"]["edition"]["mappack"],
  selectedPlayer: string | string[],
) {
  // Only take the first player if it's an array
  if (typeof selectedPlayer === "object") {
    selectedPlayer = selectedPlayer[0];
  }

  const data = selectedPlayer && await fetchGraphql(GET_CAMPAIGN_PLAYER_INFO, {
    eventHandle,
    editionId,
    login: selectedPlayer,
  });

  return {
    ...mappackData,
    leaderboard: mappackData?.leaderboard.map((row) => {
      const ranks = selectedPlayer === row.player.login && (
        data && data.event.edition.mappack?.player.ranks
      );
      return { ...row, ranks };
    }),
  };
}

export default async function Campaign({ params: { editionId: rawEditionId, eventHandle }, searchParams }: SP) {
  const editionId = parseInt(rawEditionId);
  const event = (await fetchGraphql(GET_CAMPAIGN_LEADERBOARD, {
    eventHandle,
    editionId,
  })).event;
  const mappack = event.edition.mappack;
  const data = await fetchSelectedPlayers(
    eventHandle,
    editionId,
    mappack,
    searchParams.player ?? [],
  );

  const startDate = moment(event.edition.startDate).format("DD/MM/YYYY");
  const toolbarBg = event.edition.bannerImgUrl ? {
    background: `url(${event.edition.bannerImgUrl}) center`,
    boxShadow: "inset 0 0 7em black",
    border: "solid black 1px",
  } satisfies CSSProperties : undefined;

  const admins = event.edition.admins.length > 0 ? event.edition.admins : event.admins;

  return (
    <>
      <div id="toolbar_wrapper" style={toolbarBg}>
        <div style={{ flexGrow: 1 }}>
          <h1>{event.edition.name}</h1>
          {admins.length > 0 && (
            <span>By {admins.map((player, i) => (
              <React.Fragment key={`event_author_${player.login}`}>
                <MPFormatLink
                  path={`/player/${player.login}`}
                  name={player.name}
                />
                {i < admins.length - 2 && ", " || i < admins.length - 1 && " and "}
              </React.Fragment>
            ))}</span>
          )}
        </div>
        <span>Start date: {startDate}</span>
      </div>

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
          {data.leaderboard?.map((player, i) => (
            <React.Fragment key={i}>
              <CampaignPlayerRow
                unfold={player.ranks !== false}
                login={player.player.login}
              >
                <td className="rank">{player.rank}</td>
                <td className="sr_player">
                  <MPFormatLink
                    component={NoPropagationLink}
                    path={`/player/${player.player.login}`}
                    name={player.player.name}
                  />
                </td>
                <td className="rank_avg">{player.rankAvg}</td>
                <td className="map_finished">
                  <span>
                    {player.mapFinished}
                    <small>/{mappack?.nbMaps}</small>
                  </span>
                </td>
                <td className="worst_rank">{player.worstRank}</td>
              </CampaignPlayerRow>
              {player.ranks && player.ranks.map((rank) => (
                <tr key={rank.map.gameId} className="additional">
                  <td className="rank">
                    <span
                      style={
                        rank.rank > rank.lastRank
                          ? { color: "#adadadcc" }
                          : undefined
                      }
                    >
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
    </>
  );
}
