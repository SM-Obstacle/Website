import { Suspense } from "react";

import FilterPanel, {
  type FilterGroup,
} from "@/components/filters/FilterPanel";
import ListPage from "@/components/layout/ListPage";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";

const FILTER_GROUPS: FilterGroup[] = [
  {
    title: "Player",
    fields: [
      { name: "playerLogin", label: "Login", type: "text" },
      { name: "playerName", label: "Name", type: "text" },
    ],
  },
];

export default function PlayersLayout({ children }: LayoutProps<"/players">) {
  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Players</PageTitle>]}
      selectedMenu="players"
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
