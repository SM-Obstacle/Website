import { Suspense } from "react";

import FilterPanel, { type FilterGroup } from "@/components/filters/FilterPanel";
import ListPage from "@/components/layout/ListPage";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import WithRecordAside from "@/components/records/WithRecordAside";

const FILTER_GROUPS: FilterGroup[] = [
  {
    title: "Player",
    fields: [
      { name: "playerLogin", label: "Login", type: "text" },
      { name: "playerName", label: "Name", type: "text" },
    ],
  },
  {
    title: "Map",
    fields: [
      { name: "mapUid", label: "Map UID", type: "text" },
      { name: "mapName", label: "Name", type: "text" },
    ],
  },
  {
    title: "Record",
    fields: [
      { name: "afterDate", label: "After date", type: "date" },
      { name: "beforeDate", label: "Before date", type: "date" },
      { name: "timeGt", label: "Time greater than", type: "duration" },
      { name: "timeLt", label: "Time lower than", type: "duration" },
    ],
  },
];

export default function RecordsLayout({ children }: LayoutProps<"/records">) {
  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Records</PageTitle>]}
      selectedMenu="records"
    >
      <WithRecordAside>
        <ListPage
          filters={
            <Suspense>
              <FilterPanel groups={FILTER_GROUPS} />
            </Suspense>
          }
        >
          {children}
        </ListPage>
      </WithRecordAside>
    </PageShell>
  );
}
