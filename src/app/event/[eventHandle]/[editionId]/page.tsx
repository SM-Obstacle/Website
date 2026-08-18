import type { Metadata } from "next";
import { Suspense } from "react";
import { cache } from "react";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import PageShell from "@/components/layout/PageShell";
import { Panel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import SectionHeader from "@/components/layout/SectionHeader";
import WithDetailAside from "@/components/layout/WithDetailAside";
import MappackLeaderboard from "@/components/mappack/MappackLeaderboard";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import EventHeader from "./EventHeader";
import EventPlayerAside from "./EventPlayerAside";

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

const fetchEdition = cache(async (eventHandle: string, editionId: number) =>
  query({
    query: GET_CAMPAIGN_LEADERBOARD,
    variables: { eventHandle, editionId },
    errorPolicy: "all",
  }),
);

function editionTitle(name: string, subtitle?: string | null) {
  return name + (subtitle ? ` ${subtitle}` : "");
}

export async function generateMetadata(
  props: PageProps<"/event/[eventHandle]/[editionId]">,
): Promise<Metadata> {
  const { eventHandle, editionId } = await props.params;
  const { data } = await fetchEdition(
    eventHandle,
    Number.parseInt(editionId, 10),
  );
  const edition = data?.event.edition;

  return {
    title: edition ? toPlainText(parse(editionTitle(edition.name, edition.subtitle))) : eventHandle,
  };
}

export default async function EventEditionPage(
  props: PageProps<"/event/[eventHandle]/[editionId]">,
) {
  const params = await props.params;
  const eventHandle = params.eventHandle;
  const editionId = Number.parseInt(params.editionId, 10);

  const { data, error } = await fetchEdition(eventHandle, editionId);
  const edition = data?.event.edition;

  if (error || !edition) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Events</PageTitle>]}
        selectedMenu="events"
      >
        <Panel className="m-auto p-8">
          Could not load this event: {error?.message ?? "unknown edition"}
        </Panel>
      </PageShell>
    );
  }

  const eventName = editionTitle(edition.name, edition.subtitle);
  const admins =
    edition.admins.length > 0 ? edition.admins : data.event.admins;

  return (
    <PageShell
      titleSegments={[
        <PageTitle key="title">Events</PageTitle>,
        <PageTitle key="event">{eventName}</PageTitle>,
      ]}
      selectedMenu="events"
    >
      <WithDetailAside
        aside={
          <EventPlayerAside
            eventHandle={eventHandle}
            editionId={editionId}
            eventName={eventName}
          />
        }
      >
        <div className="mx-auto flex h-full min-h-0 w-full max-w-content flex-col gap-2">
          <EventHeader edition={edition} admins={admins} />

          <Panel
            className="flex min-h-0 flex-1 flex-col"
            header={<SectionHeader title="Leaderboard" />}
          >
            <Suspense>
              <MappackLeaderboard mappack={edition.mappack} selectable />
            </Suspense>
          </Panel>
        </div>
      </WithDetailAside>
    </PageShell>
  );
}
