import { gql } from "@/app/__generated__";
import { MPFormatLink } from "@/components/MPFormat";
import { fetchGraphql } from "@/lib/utils";
import { Metadata } from "next";
import React from "react";
import { ServerProps } from "@/lib/server-props";
import moment from "moment";
import { CampaignHeader } from "@/components/CampaignMain";
import CampaignPlayerRow from "./CampaignPlayerRow";
import NoPropagationLink from "@/components/NoPropagationLink";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";
import { styled } from "../../../../../styled-system/jsx";
import Dialog from "./Dialog";
import DialogContent from "./DialogContent";

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
          player {
            login
            name
            zonePath
            role
          }
          rank
          rankAvg
          mapFinished
          worstRank
          categorizedRanks {
            categoryName
            bannerImgUrl
            hexColor
            nbMaps
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

export const CampaignPrefixSpan = styled("span", {
  base: {
    "@media only screen and (max-width: 1300px)": {
      display: "none",
    }
  }
});

async function fetchPlayerInfo(searchParams: SP["searchParams"], eventHandle: string, editionId: number) {
  const player = Array.isArray(searchParams.player) ? searchParams.player[0] : searchParams.player;
  if (!player) {
    return undefined;
  }

  return await fetchGraphql(GET_CAMPAIGN_PLAYER_INFO, {
    eventHandle,
    editionId,
    login: player,
  });
}

export default async function Campaign({ params: { editionId: rawEditionId, eventHandle }, searchParams }: SP) {
  const editionId = parseInt(rawEditionId);

  const event = (await fetchGraphql(GET_CAMPAIGN_LEADERBOARD, {
    eventHandle,
    editionId,
  })).event;
  const mappack = event.edition!.mappack;

  const playerInfo = (await fetchPlayerInfo(searchParams, eventHandle, editionId))?.event.edition?.player;

  const startDate = moment(event.edition!.startDate).format("DD/MM/YYYY");
  const admins = event.edition!.admins.length > 0 ? event.edition!.admins : event.admins;

  return (
    <>
      {playerInfo && (
        <Dialog login={playerInfo.player.login}>
          <DialogContent
            eventHandle={eventHandle}
            editionId={editionId}
            eventName={event.edition?.name}
            data={playerInfo}
            nbMaps={mappack?.nbMaps || 0}
          />
        </Dialog>
      )}
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
        bannerImgUrl={event.edition!.bannerImgUrl}
      />

      <Table>
        <Thead>
          <Tr>
            <Th rank hideRespv>
              <span>Rank</span>
            </Th>
            <Th player padRespvFirst>
              <span>Player</span>
            </Th>
            <Th campaignAttr>
              <CampaignPrefixSpan>Rank </CampaignPrefixSpan>
              <span>Average</span>
            </Th>
            <Th campaignAttr>
              <CampaignPrefixSpan>Map </CampaignPrefixSpan>
              <span>Finished</span>
            </Th>
            <Th campaignAttr>
              <span>Worst </span>
              <CampaignPrefixSpan>Rank</CampaignPrefixSpan>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {mappack?.leaderboard?.map((player, i) => (
            <CampaignPlayerRow key={i} login={player.player.login}>
              <Td rank respvUnpadRank>{player.rank}</Td>
              <Td player respvMb>
                <MPFormatLink
                  component={NoPropagationLink}
                  path={`/player/${player.player.login}`}
                  name={player.player.name}
                />
              </Td>
              <Td campaignAttr>{player.rankAvg}</Td>
              <Td campaignAttr>
                <span>
                  {player.mapFinished}
                  <small>/{mappack?.nbMaps}</small>
                </span>
              </Td>
              <Td campaignAttr>{player.worstRank}</Td>
            </CampaignPlayerRow>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
