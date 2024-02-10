import { gql } from "@/app/__generated__";
import { MPFormatLink } from "@/components/MPFormat";
import { fetchGraphql } from "@/lib/utils";
import { Metadata } from "next";
import React, { CSSProperties } from "react";
import { ServerProps } from "@/lib/server-props";
import moment from "moment";
import { fetchSelectedPlayers } from "@/lib/mappack-fragments";
import { CampaignHeader, CampaignTable } from "@/components/CampaignMain";
import { MappackLbFragment } from "@/app/__generated__/graphql";

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
        mappack {
          ...MappackPlayerInfo
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
    }).then((data) => data.event.edition!.mappack);
  };

  return fetchSelectedPlayers(mappackData, selectedPlayer, fetchPlayerInfo as any);
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

      <CampaignTable data={data} nbMaps={mappack!.nbMaps} />
    </>
  );
}
