import { format } from "date-fns";
import type { Metadata } from "next";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import { parseApiDate } from "@/lib/date";
import Link from "@/components/Link";
import PageShell from "@/components/layout/PageShell";
import { Panel, SubPanel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import MPFormat from "@/components/MPFormat";
import { Badge } from "@/components/ui/badge";

// Re-render at most once a minute so the page never serves stale data.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events",
};

const GET_EVENTS = gql(/* GraphQL */ `
  query GetEvents {
    events {
      handle
      lastEdition {
        id
        name
        subtitle
        startDate
        bannerImgUrl
        mappack {
          nbMaps
        }
      }
    }
  }
`);

export default async function EventsPage() {
  const { data, error } = await query({
    query: GET_EVENTS,
    errorPolicy: "all",
  });

  const events = (data?.events ?? []).filter((event) => event.lastEdition);

  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Events</PageTitle>]}
      selectedMenu="events"
    >
      <div className="scrollbar-slim mx-auto h-full w-full max-w-content overflow-y-auto">
        <Panel className="h-full">
          {error ? (
            <SubPanel className="p-6 text-destructive">
              Could not load the events: {error.message}
            </SubPanel>
          ) : events.length === 0 ? (
            <SubPanel className="p-6 text-muted-foreground">
              No event has been published yet.
            </SubPanel>
          ) : (
            <ul className="grid gap-2 md:grid-cols-2">
              {events.map(({ handle, lastEdition: edition }) => {
                // Filtered above, but TypeScript can't see through it.
                if (!edition) return null;

                return (
                  <li key={handle}>
                    <Link href={`/event/${handle}/${edition.id}`}>
                      <SubPanel
                        className="h-full justify-between gap-3 border border-transparent bg-black/60 bg-cover bg-center p-5 shadow-[inset_0_0_7em_black] transition-colors hover:border-white/40"
                        style={
                          edition.bannerImgUrl
                            ? {
                                backgroundImage: `url(${edition.bannerImgUrl})`,
                              }
                            : undefined
                        }
                      >
                        <div>
                          <h2 className="m-0 text-2xl font-bold drop-shadow-[2px_2px_10px_black]">
                            <MPFormat>{edition.name}</MPFormat>
                          </h2>
                          {edition.subtitle && (
                            <p className="m-0 text-sm text-white/80">
                              {edition.subtitle}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            {format(
                              parseApiDate(edition.startDate),
                              "dd/MM/yyyy",
                            )}
                          </Badge>
                          {edition.mappack && (
                            <Badge variant="secondary">
                              {edition.mappack.nbMaps} maps
                            </Badge>
                          )}
                        </div>
                      </SubPanel>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </PageShell>
  );
}
