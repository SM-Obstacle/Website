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
import { Skeleton } from "@/components/ui/skeleton";

// Re-render at most once a minute so the page never serves stale data.
export const revalidate = 60;

export default function Home() {
  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Home</PageTitle>]}
      selectedMenu="home"
    >
      {/*
       * Every block stays on screen whatever the window: the page itself never
       * scrolls, the blocks do. Each row is allowed down to nothing
       * (`minmax(0, auto)`), and while the window is short the grid hands the
       * height out evenly up to what each block needs — so a block that fits
       * keeps its full size and only the taller ones give way, scrolling
       * inside their own body under a header that stays put. When the window
       * is tall the grid stretches its `auto` rows to fill it; the records row
       * is capped at `max-content` instead, so it stays the height of its
       * rows and the spare height goes to the blocks below.
       */}
      <div className="mx-auto grid min-h-0 w-full flex-1 max-w-content grid-cols-2 grid-rows-[minmax(0,max-content)_minmax(0,auto)_minmax(0,auto)] gap-2">
        <Panel
          className="col-span-full min-h-0"
          header={<SectionHeader title="Latest records" href="/records" />}
        >
          <SubPanel className="min-h-0 flex-1 overflow-y-auto">
            <LatestRecords />
          </SubPanel>
        </Panel>

        <Panel
          className="min-h-0"
          header={
            <SectionHeader
              title="Player of the week"
              shortTitle="Player"
              href="/players"
            />
          }
        >
          <SubPanel className="min-h-0 flex-1 overflow-y-auto">
            <Suspense fallback={<OfTheWeekSkeleton />}>
              <PlayerOfTheWeek />
            </Suspense>
          </SubPanel>
        </Panel>

        <Panel
          className="min-h-0"
          header={
            <SectionHeader
              title="Map of the week"
              shortTitle="Map"
              href="/maps"
            />
          }
        >
          <SubPanel className="min-h-0 flex-1 overflow-y-auto">
            <Suspense fallback={<OfTheWeekSkeleton />}>
              <MapOfTheWeek />
            </Suspense>
          </SubPanel>
        </Panel>

        <Panel
          className="col-span-full min-h-0"
          header={<SectionHeader title="Current events" href="/events" />}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-panel">
            <Suspense
              fallback={<Skeleton className="h-40 w-full rounded-panel" />}
            >
              <CurrentEvents />
            </Suspense>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
