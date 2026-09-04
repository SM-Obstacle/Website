import Link from "next/link";
import { Suspense } from "react";

import type { MapInfoFragment } from "@/app/__generated__/graphql";
import { Panel } from "@/components/layout/Panel";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import SectionHeader from "@/components/layout/SectionHeader";
import MPFormat from "@/components/MPFormat";
import WithRecordAside from "@/components/records/WithRecordAside";
import MapInfo, { type MapEventContext } from "./MapInfo";
import MapLeaderboard from "./MapLeaderboard";

/**
 * A map, its leaderboard, and the details of whichever record is picked.
 *
 * Both `/map/[gameId]` and an event edition's own copy of a map render this
 * page: the routes only differ in where they read the map from, so everything
 * a reader sees is decided here once. `event` is what an edition adds to it —
 * its own records, its medal times, and the trail back to the event.
 */
export default function MapPage({
  map,
  event,
}: {
  map: MapInfoFragment;
  event?: MapEventContext;
}) {
  // An edition's records are its own, and the records page knows nothing
  // about them — only a plain map has more of itself to show there. Exact:
  // this map's own records, not those of every map whose UID contains it.
  const allRecordsHref = event
    ? undefined
    : `/records?mapUid=${encodeURIComponent(map.gameId)}&mapUidExact=1`;

  return (
    <PageShell
      titleSegments={[
        <PageTitle key="title">
          <Link href={event ? "/events" : "/maps"}>
            {event ? "Events" : "Maps"}
          </Link>
        </PageTitle>,
        <PageTitle key="map">
          <MPFormat>{map.name}</MPFormat>
        </PageTitle>,
      ]}
      selectedMenu={event ? "events" : "maps"}
    >
      <WithRecordAside>
        <div className="mx-auto flex h-full min-h-0 w-full max-w-content flex-col gap-2 [--profile-picture-size:75px] lg:[--profile-picture-size:100px]">
          <MapInfo map={map} event={event} />

          <Panel
            className="flex min-h-0 flex-1 flex-col"
            header={
              <SectionHeader title="Leaderboard" href={allRecordsHref} />
            }
          >
            <Suspense>
              <MapLeaderboard gameId={map.gameId} event={event} />
            </Suspense>
          </Panel>
        </div>
      </WithRecordAside>
    </PageShell>
  );
}
