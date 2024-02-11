import { gql } from "@/app/__generated__";
import { MPFormatLink } from "@/components/MPFormat";
import { cmpMedals, fetchGraphql } from "@/lib/utils";
import { Metadata } from "next";
import React, { CSSProperties } from "react";
import { ServerProps } from "@/lib/server-props";
import moment from "moment";
import { fetchSelectedPlayers } from "@/lib/mappack-fragments";
import { CampaignHeader, CampaignTable } from "@/components/CampaignMain";
import { MappackLbFragment, Medal, MedalTimes } from "@/app/__generated__/graphql";
import CampaignPlayerRow from "./CampaignPlayerRow";
import NoPropagationLink from "@/components/NoPropagationLink";
import MedalImage from "./Medal";
import Time from "@/components/Time";

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
          ...MappackLb
        }
      }
    }
  }
`);

const GET_CAMPAIGN_PLAYER_INFO = gql(/* GraphQL */ `
  query GetCampaignPlayerInfo($eventHandle: String!, $editionId: Int!, $login: String!) {
    event(handle: $eventHandle) {
      edition(editionId: $editionId) {
        player(login: $login) {
          categorizedRanks {
            categoryName
            bannerImgUrl
            ranks {
              rank
              time
              map {
                map {
                  gameId
                  name
                }
                lastRank
                medalTimes {
                  bronzeTime
                  silverTime
                  goldTime
                  championTime
                }
              }
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

export async function generateMetadata(
  { params: { editionId: rawEditionId, eventHandle } }: SP,
): Promise<Metadata> {
  const editionId = parseInt(rawEditionId);
  const event = (await fetchGraphql(GET_CAMPAIGN_LEADERBOARD, {
    eventHandle,
    editionId,
  })).event;

  return {
    title: event.edition!.name,
  };
}

async function fetchPlayers(
  eventHandle: string,
  editionId: number,
  mappackData: MappackLbFragment | undefined | null,
  selectedPlayer: string | string[],
) {
  const fetchPlayerInfo = async (login: string) => {
    return fetchGraphql(GET_CAMPAIGN_PLAYER_INFO, {
      eventHandle,
      editionId,
      login,
    }).then((data) => data.event.edition!.player.categorizedRanks);
  };

  if (Array.isArray(selectedPlayer)) {
    selectedPlayer = selectedPlayer[0];
  }

  const data = selectedPlayer && await fetchPlayerInfo(selectedPlayer);

  const withMedalPerMap = data && data.filter((rank) => rank.ranks.length > 0)
    .map((rank) => ({
      ...rank,
      ranks: rank.ranks.map((rank) => ({
        ...rank,
        map: {
          ...rank.map,
          medal: rank.time > rank.map.medalTimes.bronzeTime ? null
            : rank.time > rank.map.medalTimes.silverTime ? Medal.Bronze
              : rank.time > rank.map.medalTimes.goldTime ? Medal.Silver
                : rank.time > rank.map.medalTimes.championTime ? Medal.Gold
                  : Medal.Champion
        }
      }))
    }));

  const withMedalPerCategory = withMedalPerMap && withMedalPerMap.map((rank) => ({
    ...rank,
    medal: rank.ranks.length > 0 && rank.ranks.map((rank) => rank.map.medal)
      .reduce((medalAcc, medal) => cmpMedals(medalAcc, medal) > 0 ? medal : medalAcc, Medal.Champion)
  }));

  return {
    ...mappackData,
    leaderboard: mappackData?.leaderboard.map((row) => {
      const ranks = selectedPlayer === row.player.login && withMedalPerCategory;
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
  const mappack = event.edition!.mappack;
  const data = await fetchPlayers(
    eventHandle,
    editionId,
    mappack,
    searchParams.player ?? [],
  );

  const startDate = moment(event.edition!.startDate).format("DD/MM/YYYY");
  const toolbarBg = event.edition!.bannerImgUrl ? {
    background: `url(${event.edition!.bannerImgUrl}) center`,
    backgroundSize: "cover",
    boxShadow: "inset 0 0 7em black",
    border: "solid black 1px",
  } satisfies CSSProperties : undefined;

  const admins = event.edition!.admins.length > 0 ? event.edition!.admins : event.admins;

  return (
    <>
      <CampaignHeader
        title={event.edition!.name}
        startDate={startDate}
        authors={admins.length > 0 && (
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
        style={toolbarBg}
      />

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
                <React.Fragment key={rank.categoryName}>
                  <tr className="additional">
                    <td className="sr_player">{rank.categoryName}</td>
                    <td className="medals">
                      <MedalImage medal={rank.medal || null} />
                    </td>
                  </tr>
                  {rank.ranks.map((rank) => (
                    <tr key={rank.map.map.gameId} className="additional">
                      <td className="rank">
                        <span
                          style={rank.rank > rank.map.lastRank
                            ? { color: "#adadadcc" }
                            : undefined}
                        >
                          {rank.rank}
                          <small>/{rank.map.lastRank}</small>
                        </span>
                      </td>
                      <td className="sr_player">
                        <MPFormatLink
                          path={`/map/${rank.map.map.gameId}`}
                          name={rank.map.map.name} />
                      </td>
                      <td className="time">
                        <Time>{rank.time}</Time>
                      </td>
                      <td className="medals">
                        <MedalImage medal={rank.map.medal} />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}
