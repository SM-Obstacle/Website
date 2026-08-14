import { Panel } from "./Panel";

/**
 * Two-pane layout for the browsable lists (records, players, maps): filters
 * beside the results on large screens, stacked below `lg`.
 */
export default function ListPage({
  filters,
  children,
}: React.PropsWithChildren<{ filters: React.ReactNode }>) {
  return (
    <div className="mx-auto grid h-full min-h-0 w-full max-w-[calc(var(--content-max)+19rem)] grid-rows-[auto_minmax(0,1fr)] gap-2 lg:grid-cols-[19rem_minmax(0,1fr)] lg:grid-rows-1">
      {filters}

      <Panel className="flex h-full min-h-0 flex-col gap-2">{children}</Panel>
    </div>
  );
}
