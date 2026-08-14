import { Suspense } from "react";

import FilterPanel, {
  type FilterGroup,
} from "@/components/filters/FilterPanel";
import ListPage from "@/components/layout/ListPage";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";

const FILTER_GROUPS: FilterGroup[] = [
  {
    title: "Map",
    fields: [
      { name: "mapUid", label: "Map UID", type: "text" },
      { name: "mapName", label: "Name", type: "text" },
    ],
  },
  {
    title: "Author",
    fields: [
      { name: "playerLogin", label: "Login", type: "text" },
      { name: "playerName", label: "Name", type: "text" },
    ],
  },
];

export default function MapsLayout({ children }: LayoutProps<"/maps">) {
  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Maps</PageTitle>]}
      selectedMenu="maps"
    >
      <ListPage
        filters={
          <Suspense>
            <FilterPanel groups={FILTER_GROUPS} />
          </Suspense>
        }
      >
        {children}
      </ListPage>
    </PageShell>
  );
}
