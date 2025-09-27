import React, { type CSSProperties } from "react";
import CampaignPlayerRow from "@/app/event/[eventHandle]/[editionId]/CampaignPlayerRow";
import type { fetchSelectedPlayers } from "@/lib/mappack-fragments";
import { css } from "../../styled-system/css";
import { styled } from "../../styled-system/jsx";
import { MPFormatLink } from "./MPFormat";
import NoPropagationLink from "./NoPropagationLink";
import {
  ToolBarWrapper,
  ToolbarTitle,
  ToolbarTitleWrapper,
} from "./ToolbarWrapper";

export const CampaignPrefixSpan = styled("span", {
  base: {
    "@media only screen and (max-width: 1300px)": {
      display: "none",
    },
  },
});

export function CampaignHeader({
  title,
  authors,
  startDate,
  bannerImgUrl,
}: {
  title: string;
  authors: React.ReactNode;
  startDate: string;
  bannerImgUrl: string | null | undefined;
}) {
  const campaignWrapper = css({
    background: "var(--bannerImgUrl)",
    backgroundSize: "cover",
    boxShadow: "inset 0 0 7em black",
    border: "solid black 1px",
  });
  const backgroundUrl = bannerImgUrl ? `url(${bannerImgUrl})` : "inherit";

  return (
    <ToolBarWrapper
      style={
        {
          "--bannerImgUrl": backgroundUrl,
        } as CSSProperties
      }
      className={campaignWrapper}
    >
      <ToolbarTitleWrapper>
        <ToolbarTitle withShadow>{title}</ToolbarTitle>
        {authors}
      </ToolbarTitleWrapper>
      <span>Start date: {startDate}</span>
    </ToolBarWrapper>
  );
}

export function CampaignTable({
  data,
  nbMaps,
}: {
  data: Awaited<ReturnType<typeof fetchSelectedPlayers>>;
  nbMaps: number;
}) {
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
        {data.leaderboard?.map((player) => (
          <React.Fragment key={player.player.login}>
            <CampaignPlayerRow login={player.player.login}>
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
                  <small>/{nbMaps}</small>
                </span>
              </td>
              <td className="worst_rank">{player.worstRank}</td>
            </CampaignPlayerRow>
            {player.ranks?.map((rank) => (
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
  );
}
