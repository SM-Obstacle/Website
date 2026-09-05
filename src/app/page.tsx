import { Suspense } from "react";

import CurrentEvents from "@/components/home/CurrentEvents";
import LatestRecords from "@/components/home/LatestRecords";
import MapOfTheWeek from "@/components/home/MapOfTheWeek";
import { OfTheWeekSkeleton } from "@/components/home/OfTheWeek";
import PlayerOfTheWeek from "@/components/home/PlayerOfTheWeek";
import PageShell from "@/components/layout/PageShell";
import { Panel, SubPanel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import SectionHeader from "@/components/layout/SectionHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Re-render at most once a minute so the page never serves stale data.
export const revalidate = 60;

export default function Home() {
  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Home</PageTitle>]}
      selectedMenu="home"
    >
      <ScrollArea className="mx-auto h-full w-full max-w-content">
        <div className="flex grow flex-col gap-2 md:grid md:grid-cols-2 md:grid-rows-[min-content_auto_auto]">
          <Panel
            className="col-span-full row-start-1 min-w-0"
            header={<SectionHeader title="Latest records" href="/records" />}
          >
            <SubPanel className="min-w-0">
              <LatestRecords />
            </SubPanel>
          </Panel>

          <Panel
            className="col-start-1 row-start-2"
            header={<SectionHeader title="Player of the week" href="/players" />}
          >
            <SubPanel className="h-full">
              <Suspense fallback={<OfTheWeekSkeleton />}>
                <PlayerOfTheWeek />
              </Suspense>
            </SubPanel>
          </Panel>

          <Panel
            className="col-start-2 row-start-2"
            header={<SectionHeader title="Map of the week" href="/maps" />}
          >
            <SubPanel className="h-full">
              <Suspense fallback={<OfTheWeekSkeleton />}>
                <MapOfTheWeek />
              </Suspense>
            </SubPanel>
          </Panel>

          <Panel
            className="col-span-full row-start-3"
            header={<SectionHeader title="Current events" href="/events" />}
          >
            <Suspense
              fallback={
                <Skeleton className="h-40 w-full rounded-panel" />
              }
            >
              <CurrentEvents />
            </Suspense>
          </Panel>
        </div>
      </ScrollArea>
    </PageShell>
  );
}
