import { format } from "date-fns";
import { CalendarDays, Map as MapIcon } from "lucide-react";
import type { Metadata } from "next";
import { cache, Suspense } from "react";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import { parseApiDate } from "@/lib/date";
import PageShell from "@/components/layout/PageShell";
import { Panel, SubPanel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import SectionHeader from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/badge";
import MappackStandings from "./MappackStandings";
import catchGqlError from "@/lib/catchError";

const GET_MAPPACK_LEADERBOARD = gql(/* GraphQL */ `
  query GetMappackLeaderboard($mappackId: String!) {
    mappack(mappackId: $mappackId) {
      mxAuthor
      mxCreatedAt
      mxName
      ...MappackLb
    }
  }
`);

const fetchMappack = cache(async (mappackId: string) =>
  query({
    query: GET_MAPPACK_LEADERBOARD,
    variables: { mappackId },
  }).catch(catchGqlError),
);

export async function generateMetadata(
  props: PageProps<"/mappack/[mxId]">,
): Promise<Metadata> {
  const { mxId } = await props.params;
  const { data } = await fetchMappack(mxId);

  return { title: data?.mappack.mxName ?? `Mappack ${mxId}` };
}

export default async function MappackPage(props: PageProps<"/mappack/[mxId]">) {
  const { mxId } = await props.params;

  const { data, error } = await fetchMappack(mxId);
  const mappack = data?.mappack;

  if (error || !mappack) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Events</PageTitle>]}
        selectedMenu="events"
      >
        <Panel className="m-auto p-8">
          Could not load this mappack: {error?.message ?? "unknown mappack"}
        </Panel>
      </PageShell>
    );
  }

  const name = mappack.mxName ?? `Mappack ${mxId}`;

  return (
    <PageShell
      titleSegments={[
        <PageTitle key="title">Events</PageTitle>,
        <PageTitle key="mappack">{name}</PageTitle>,
      ]}
      selectedMenu="events"
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-content flex-col gap-2">
        <Panel>
          <SubPanel className="gap-3 px-5 py-3">
            <div>
              <h2 className="m-0 truncate text-2xl font-black">{name}</h2>
              {mappack.mxAuthor && (
                <span className="text-sm">By {mappack.mxAuthor}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {mappack.mxCreatedAt && (
                <Badge variant="secondary">
                  <CalendarDays />
                  {format(parseApiDate(mappack.mxCreatedAt), "dd/MM/yyyy")}
                </Badge>
              )}
              <Badge variant="secondary">
                <MapIcon />
                {mappack.nbMaps} maps
              </Badge>
            </div>
          </SubPanel>
        </Panel>

        <Panel
          className="flex min-h-0 flex-1 flex-col"
          header={<SectionHeader title="Leaderboard" />}
        >
          <Suspense>
            <MappackStandings
              mappackId={mxId}
              mappackName={name}
              mappack={mappack}
            />
          </Suspense>
        </Panel>
      </div>
    </PageShell>
  );
}
