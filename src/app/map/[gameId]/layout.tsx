import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import PageShell from "@/components/layout/PageShell";
import { Panel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import SectionHeader from "@/components/layout/SectionHeader";
import MPFormat from "@/components/MPFormat";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import MapInfo from "./MapInfo";

const GET_MAP_INFO = gql(/* GraphQL */ `
  query GetMap($gameId: String!) {
    map(gameId: $gameId) {
      gameId
      name
      cpsNumber
      player {
        login
        name
      }
      relatedEventEditions {
        map {
          gameId
        }
        redirectToEvent
        edition {
          name
          subtitle
          event {
            handle
          }
          id
        }
      }
    }
  }
`);

export async function generateMetadata(
  props: LayoutProps<"/map/[gameId]">,
): Promise<Metadata> {
  const { gameId } = await props.params;
  const { data } = await query({
    query: GET_MAP_INFO,
    variables: { gameId },
    errorPolicy: "all",
  });

  return { title: data ? toPlainText(parse(data.map.name)) : gameId };
}

export default async function MapLayout(props: LayoutProps<"/map/[gameId]">) {
  const { gameId } = await props.params;

  const { data, error } = await query({
    query: GET_MAP_INFO,
    variables: { gameId },
    errorPolicy: "all",
  });

  if (error || !data) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Maps</PageTitle>]}
        selectedMenu="maps"
      >
        <Panel className="m-auto p-8">
          Could not load this map: {error?.message ?? "unknown error"}
        </Panel>
      </PageShell>
    );
  }

  // A map that only exists inside an event has no records of its own, so it
  // belongs on the event's own map page.
  const [related] = data.map.relatedEventEditions;
  if (data.map.relatedEventEditions.length === 1 && related.redirectToEvent) {
    redirect(
      `/event/${related.edition.event.handle}/${related.edition.id}/map/${gameId}`,
    );
  }

  return (
    <PageShell
      titleSegments={[
        <PageTitle key="title">Maps</PageTitle>,
        <PageTitle key="map">
          <MPFormat>{data.map.name}</MPFormat>
        </PageTitle>,
      ]}
      selectedMenu="maps"
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-content flex-col gap-2 [--profile-picture-size:75px] lg:[--profile-picture-size:100px]">
        <MapInfo map={data.map} />

        <Panel
          className="flex min-h-0 flex-1 flex-col"
          header={
            <SectionHeader
              title="Leaderboard"
              href={`/records?mapUid=${data.map.gameId}`}
            />
          }
        >
          {props.children}
        </Panel>
      </div>
    </PageShell>
  );
}
