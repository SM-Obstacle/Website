import CampaignPlayerRow from "@/app/event/[eventHandle]/[editionId]/CampaignPlayerRow";
import { fetchSelectedPlayers } from "@/lib/mappack-fragments";
import React from "react";
import { HTMLAttributes, PropsWithChildren } from "react";
import { MPFormatLink } from "./MPFormat";
import NoPropagationLink from "./NoPropagationLink";

export function CampaignHeader({
  title,
  authors,
  startDate,
  ...rest
}: {
  title: string,
  authors: React.ReactNode,
  startDate: string,
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div id="toolbar_wrapper" {...rest}>
      <div style={{ flexGrow: 1 }}>
        <h1>{title}</h1>
        {authors}
      </div>
      <span>Start date: {startDate}</span>
    </div>
  );
}

export function CampaignTable({
  data,
  nbMaps,
}: {
  data: Awaited<ReturnType<typeof fetchSelectedPlayers>>,
  nbMaps: number,
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
                  <small>/{nbMaps}</small>
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
  );
}