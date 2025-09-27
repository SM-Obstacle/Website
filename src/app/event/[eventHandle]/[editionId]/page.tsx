import moment from "moment";
import type { Metadata } from "next";
import React from "react";
import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import { CampaignHeader, CampaignPrefixSpan } from "@/components/CampaignMain";
import { MPFormatLink } from "@/components/MPFormat";
import NoPropagationLink from "@/components/NoPropagationLink";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";
import type { ServerProps } from "@/lib/server-props";
import { styled } from "../../../../../styled-system/jsx";
import CampaignPlayerRow from "./CampaignPlayerRow";
import Countdown from "./Countdown";
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
        subtitle
        startDate
        expiresIn
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
  query GetCampaignPlayerInfo(
    $eventHandle: String!
    $editionId: Int!
    $login: String!
  ) {
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
          unfinishedMaps {
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
`);

type SP = ServerProps<
  {
    eventHandle: string;
    editionId: string;
  },
  { player?: string | string[] }
>;

export async function generateMetadata(props: SP): Promise<Metadata> {
  const params = await props.params;
  const editionId = parseInt(params.editionId, 10);
  const event = (
    await query({
      query: GET_CAMPAIGN_LEADERBOARD,
      variables: {
        eventHandle: params.eventHandle,
        editionId,
      },
      errorPolicy: "all",
    })
  ).data?.event;

  return {
    title: event?.edition?.name ?? "",
  };
}

async function fetchPlayerInfo(
  searchParams: Awaited<SP["searchParams"]>,
  eventHandle: string,
  editionId: number,
) {
  const player = Array.isArray(searchParams.player)
    ? searchParams.player[0]
    : searchParams.player;
  if (!player) {
    return undefined;
  }

  return await query({
    query: GET_CAMPAIGN_PLAYER_INFO,
    variables: {
      eventHandle,
      editionId,
      login: player,
    },
    errorPolicy: "all",
  });
}

const BottomRightInfo = styled("div", {
  base: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 100,
    transform: "translate3d(0, 0, 0)",
    bg: "black",
    borderTopLeftRadius: 10,
    padding: 1,
  },
});

export default async function Campaign(props: SP) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const editionId = parseInt(params.editionId, 10);

  const { data, error } = await query({
    query: GET_CAMPAIGN_LEADERBOARD,
    variables: {
      eventHandle: params.eventHandle,
      editionId,
    },
    errorPolicy: "all",
  });

  const event = data?.event;
  const mappack = event?.edition?.mappack;

  const eventName =
    event?.edition?.name +
    (event?.edition?.subtitle ? ` ${event.edition.subtitle}` : "");

  const playerInfo = (
    await fetchPlayerInfo(searchParams, params.eventHandle, editionId)
  )?.data?.event.edition?.player;

  const startDate = moment(event?.edition?.startDate).format("DD/MM/YYYY");
  const admins =
    (event?.edition?.admins.length ?? 0) > 0
      ? event?.edition?.admins ?? []
      : event?.admins ?? [];

  return error ? (
    error.message
  ) : (
    <>
      {playerInfo && (
        <Dialog login={playerInfo.player.login}>
          <DialogContent
            eventHandle={params.eventHandle}
            editionId={editionId}
            eventName={eventName}
            data={playerInfo}
            nbMaps={mappack?.nbMaps || 0}
          />
        </Dialog>
      )}
      <CampaignHeader
        title={eventName}
        startDate={startDate}
        authors={
          admins.length > 0 && (
            <span>
              By{" "}
              {admins.map((player, i) => (
                <React.Fragment key={`event_author_${player.login}`}>
                  <MPFormatLink
                    path={`/player/${player.login}`}
                    name={player.name}
                  />
                  {(i < admins.length - 2 && ", ") ||
                    (i < admins.length - 1 && " and ")}
                </React.Fragment>
              ))}
            </span>
          )
        }
        bannerImgUrl={event?.edition?.bannerImgUrl}
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
            <Th campaignAttr alignRightSm>
              <CampaignPrefixSpan>Map </CampaignPrefixSpan>
              <span>Finished</span>
            </Th>
            <Th campaignAttr date hideRespv>
              <span>Worst</span>
              <CampaignPrefixSpan> Rank</CampaignPrefixSpan>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {mappack?.leaderboard?.map((player) => (
            <CampaignPlayerRow
              key={player.player.login}
              login={player.player.login}
            >
              <Td rank respvUnpadRank>
                {player.rank}
              </Td>
              <Td player respvMb>
                <MPFormatLink
                  component={NoPropagationLink}
                  path={`/player/${player.player.login}`}
                  name={player.player.name}
                />
              </Td>
              <Td campaignAttr>{player.rankAvg}</Td>
              <Td campaignAttr alignRightSm>
                <span>
                  {player.mapFinished}
                  <small>/{mappack?.nbMaps}</small>
                </span>
              </Td>
              <Td campaignAttr date hideRespv>
                {player.worstRank}
              </Td>
            </CampaignPlayerRow>
          ))}
        </Tbody>
      </Table>

      {mappack?.nextUpdateIn ? (
        event?.edition?.expiresIn &&
        event?.edition?.expiresIn >= 0 &&
        event?.edition?.expiresIn < mappack.nextUpdateIn ? (
          <BottomRightInfo color="orange">
            Expires in <Countdown start={event.edition.expiresIn} />
          </BottomRightInfo>
        ) : (
          <BottomRightInfo>
            Next update in <Countdown start={mappack.nextUpdateIn} />
          </BottomRightInfo>
        )
      ) : (
        <BottomRightInfo color="red">Expired</BottomRightInfo>
      )}
    </>
  );
}
