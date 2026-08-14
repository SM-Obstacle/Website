import { Flag } from "lucide-react";
import type { Metadata } from "next";
import { cache, Suspense } from "react";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import Link from "@/components/Link";
import PageShell from "@/components/layout/PageShell";
import { Panel, SubPanel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import SectionHeader from "@/components/layout/SectionHeader";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import { Badge } from "@/components/ui/badge";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import EventMapRecordsTable from "./EventMapRecordsTable";

const GET_EVENT_MAP_INFO = gql(/* GraphQL */ `
  query GetEventMapInfo(
    $eventHandle: String!
    $editionId: Int!
    $gameId: String!
  ) {
    event(handle: $eventHandle) {
      edition(editionId: $editionId) {
        name
        subtitle
        map(gameId: $gameId) {
          map {
            gameId
            name
            cpsNumber
            player {
              login
              name
            }
          }
          linkToOriginal
          originalMap {
            gameId
          }
        }
      }
    }
  }
`);

const fetchMap = cache(
  async (eventHandle: string, editionId: number, gameId: string) =>
    query({
      query: GET_EVENT_MAP_INFO,
      variables: { eventHandle, editionId, gameId },
      errorPolicy: "all",
    }),
);

export async function generateMetadata(
  props: PageProps<"/event/[eventHandle]/[editionId]/map/[gameId]">,
): Promise<Metadata> {
  const { eventHandle, editionId, gameId } = await props.params;
  const { data } = await fetchMap(
    eventHandle,
    Number.parseInt(editionId, 10),
    gameId,
  );

  const name = data?.event.edition?.map.map.name;
  return { title: name ? toPlainText(parse(name)) : gameId };
}

export default async function EventMapPage(
  props: PageProps<"/event/[eventHandle]/[editionId]/map/[gameId]">,
) {
  const params = await props.params;
  const eventHandle = params.eventHandle;
  const editionId = Number.parseInt(params.editionId, 10);
  const gameId = params.gameId;

  const { data, error } = await fetchMap(eventHandle, editionId, gameId);
  const edition = data?.event.edition;
  const eventMap = edition?.map;

  if (error || !eventMap) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Events</PageTitle>]}
        selectedMenu="events"
      >
        <Panel className="m-auto p-8">
          Could not load this map: {error?.message ?? "unknown map"}
        </Panel>
      </PageShell>
    );
  }

  const eventName = edition.name + (edition.subtitle ? ` ${edition.subtitle}` : "");
  const originalGameId =
    eventMap.originalMap?.gameId ||
    (eventMap.linkToOriginal ? eventMap.map.gameId : undefined);

  return (
    <PageShell
      titleSegments={[
        <PageTitle key="title">Events</PageTitle>,
        <PageTitle key="map">
          <MPFormat>{eventMap.map.name}</MPFormat>
        </PageTitle>,
      ]}
      selectedMenu="events"
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-content flex-col gap-2">
        <Panel>
          <SubPanel className="gap-2 px-5 py-3">
            <h2 className="m-0 truncate text-2xl font-bold">
              <MPFormat>{eventMap.map.name}</MPFormat>
            </h2>

            <p className="m-0 text-sm">
              by{" "}
              <MPFormatLink path={`/player/${eventMap.map.player.login}`}>
                {eventMap.map.player.name}
              </MPFormatLink>{" "}
              on{" "}
              <Link explicit href={`/event/${eventHandle}/${editionId}`}>
                {eventName}
              </Link>
              {originalGameId && (
                <>
                  {" — see the "}
                  <Link explicit href={`/map/${originalGameId}`}>
                    original map
                  </Link>
                </>
              )}
            </p>

            {!!eventMap.map.cpsNumber && (
              <div>
                <Badge variant="secondary">
                  <Flag />
                  {eventMap.map.cpsNumber} cp
                  {eventMap.map.cpsNumber > 1 ? "s" : ""}
                </Badge>
              </div>
            )}
          </SubPanel>
        </Panel>

        <Panel
          className="flex min-h-0 flex-1 flex-col"
          header={<SectionHeader title="Leaderboard" />}
        >
          <Suspense>
            <EventMapRecordsTable
              eventHandle={eventHandle}
              editionId={editionId}
              gameId={gameId}
            />
          </Suspense>
        </Panel>
      </div>
    </PageShell>
  );
}
