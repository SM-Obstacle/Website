import { gql } from "@/app/__generated__";
import { MPFormatLink } from "@/components/MPFormat";
import TableRow from "@/components/TableRow";
import { fetchGraphql } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

export const GET_CAMPAIGN_LEADERBOARD = gql(/* GraphQL */ `
  query GetCampaignLeaderboard($mappackId: String!) {
    mappack(mappackId: $mappackId) {
      maps {
        map
        mapId
        lastRank
      }
      scores {
        rank
        login
        name
        score
        worst {
          rank
        }
        ranks {
          rank
          mapIdx
        }
        mapsFinished
      }
    }
  }
`);

export async function generateMetadata(
  { params }: { params: { mappackId: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const oldTitle = (await parent).title?.absolute;

  return {
    title: `${oldTitle} - Campaign ${params.mappackId}`,
  };
}

export default async function Campaign({
  params
}: {
  params: { mappackId: string; };
}) {
  const mappack = (await fetchGraphql(GET_CAMPAIGN_LEADERBOARD, { mappackId: params.mappackId })).mappack;

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
        {mappack.scores.map((score, i) => (
          <React.Fragment key={i}>
            <TableRow>
              <td className="rank">{score.rank}</td>
              <td className="sr_player">
                <MPFormatLink
                  path={`/player/${score.login}`}
                  name={score.name}
                />
              </td>
              <td className="rank_avg">{Math.round((score.score + Number.EPSILON) * 100) / 100}</td>
              <td className="map_finished">
                <span>
                  {score.mapsFinished}
                  <small>/{score.ranks.length}</small>
                </span>
              </td>
              <td className="worst_rank">{score.worst.rank}</td>
            </TableRow>
            {score.ranks.map((rank, j) => {
              const map = mappack.maps[rank.mapIdx];
              return (
                <tr key={`${i}${j}`} className="additional">
                  <td className="rank">
                    <span>
                      {rank.rank}
                      <small>/{map.lastRank}</small>
                    </span>
                  </td>
                  <td className="sr_player">
                    <MPFormatLink
                      path={`/map/${map.mapId}`}
                      name={map.map}
                    />
                  </td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

