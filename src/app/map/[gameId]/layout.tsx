import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import PageShell from "@/components/layout/PageShell";
import { Panel, SubPanel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import SectionHeader from "@/components/layout/SectionHeader";
import MPFormat from "@/components/MPFormat";
import WithRecordAside from "@/components/records/WithRecordAside";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import MapInfo from "./MapInfo";
import Link from "next/link";
import LoadErrorPanel from "@/components/layout/LoadErrorPanel";
import catchGqlError from "@/lib/catchError";

const GET_MAP_INFO = gql(/* GraphQL */ `
  query GetMap($gameId: String!) {
    map(gameId: $gameId) {
      gameId
      mxId
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
  }).catch(catchGqlError);

  return { title: data ? toPlainText(parse(data.map.name)) : gameId };
}

export default async function MapLayout(props: LayoutProps<"/map/[gameId]">) {
  const { gameId } = await props.params;

  const { data, error } = await query({
    query: GET_MAP_INFO,
    variables: { gameId },
  }).catch(catchGqlError);

  if (error || !data) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Maps</PageTitle>]}
        selectedMenu="maps"
      >
        <LoadErrorPanel title="Invalid map">
          Could not load this map: {error?.message ?? "unknown error"}
        </LoadErrorPanel>
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
        <PageTitle key="title">
          <Link href="/maps">Maps</Link>
        </PageTitle>,
        <PageTitle key="map">
          <MPFormat>{data.map.name}</MPFormat>
        </PageTitle>,
      ]}
      selectedMenu="maps"
    >
      <WithRecordAside>
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
      </WithRecordAside>
    </PageShell>
  );
}
