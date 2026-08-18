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
import catchGqlError from "@/lib/catchError";

// Re-render at most once a minute so the page never serves stale data.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events",
};

const GET_EVENTS = gql(/* GraphQL */ `
  query GetEvents {
    events {
      handle
      editions {
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
  }).catch(catchGqlError);

  const events = (data?.events ?? [])
    .flatMap((event) => event.editions.map((edition) => ({ event, edition })))
    .toSorted(({ edition: a }, { edition: b }) =>
      String(b.startDate).localeCompare(a.startDate),
    );

  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Events</PageTitle>]}
      selectedMenu="events"
    >
      <div className="mx-auto h-full w-full max-w-content">
        {/* The panel keeps the viewport's height and the editions scroll inside
            it, so the frame stays put instead of riding up with the list.
            Rounded like a sub-panel so what scrolls is clipped along the same
            curve as the panel around it. */}
        <Panel className="h-full min-h-0 overflow-hidden">
          <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-inset overflow-y-auto rounded-panel">
            {error ? (
              <SubPanel className="p-6 text-destructive">
                Could not load the events: {error.message}
              </SubPanel>
            ) : events.length === 0 ? (
              <SubPanel className="p-6 text-muted-foreground">
                No event has been published yet.
              </SubPanel>
            ) : (
              /* `auto-rows-fr` sizes every row to the tallest one rather than to
               its own contents, so an edition carrying a subtitle doesn't make
               its row taller than the rows below it. The link has to be a block
               of full height for the card to reach the bottom of the row it is
               given — as an inline box its `h-full` has nothing to fill. */
              <ul className="grid auto-rows-fr gap-2 md:grid-cols-2">
                {events.map(({ event: { handle }, edition }) => (
                  <li key={`${handle}_${edition.id}`}>
                    <Link
                      href={`/event/${handle}/${edition.id}`}
                      className="block h-full"
                    >
                      {/* The scrim goes over the banner where there is one and
                        stands in for it where there is not, so an edition
                        without artwork reads as a plain card in the theme's
                        own tone rather than a dark slab. */}
                      <SubPanel
                        // `bg-clip-padding` keeps the banner out from under the
                        // border, which the vignette does not reach: left there
                        // it draws a hard ring of raw image around the card.
                        className="h-full justify-between gap-3 border border-transparent bg-(--banner-scrim) bg-cover bg-clip-padding bg-center p-5 shadow-[inset_0_0_7em_var(--banner-edge)] transition-colors hover:border-foreground/40"
                        style={
                          edition.bannerImgUrl
                            ? {
                                backgroundImage: `url(${edition.bannerImgUrl})`,
                              }
                            : undefined
                        }
                      >
                        <div>
                          <h2 className="m-0 text-2xl font-bold drop-shadow-[2px_2px_10px_var(--banner-edge)]">
                            <MPFormat>{edition.name}</MPFormat>
                          </h2>
                          {edition.subtitle && (
                            <p className="m-0 text-sm text-foreground/80">
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
                ))}
              </ul>
            )}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
