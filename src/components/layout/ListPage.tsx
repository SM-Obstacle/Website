"use client";

import { createContext, useContext, useState } from "react";

import { cn } from "@/lib/utils";
import { Panel } from "./Panel";

interface FiltersState {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const FiltersContext = createContext<FiltersState | null>(null);

export function useFilters(): FiltersState {
  const context = useContext(FiltersContext);

  if (context === null) {
    throw new Error("useFilters must be called inside a <ListPage>");
  }

  return context;
}

/**
 * Two-pane layout for the browsable lists (records, players, maps): filters
 * beside the results on large screens, stacked below `lg`.
 *
 * The open/closed state of the filters lives here rather than in the panel,
 * because opening them on the narrow layout has to hide the results and hand
 * the whole height over — done by swapping grid rows, so both panels stay in
 * normal flow.
 */
export default function ListPage({
  filters,
  children,
}: React.PropsWithChildren<{ filters: React.ReactNode }>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <FiltersContext value={{ expanded, setExpanded }}>
      <div
        className={cn(
          "mx-auto grid h-full min-h-0 w-full max-w-[calc(var(--content-max)+19rem)] gap-inset",
          expanded
            ? "grid-rows-[minmax(0,1fr)]"
            : "grid-rows-[auto_minmax(0,1fr)]",
          "lg:grid-cols-[19rem_minmax(0,1fr)] lg:grid-rows-1",
        )}
      >
        {/*
         * The filters sit in a flex column that fills the grid area. That lets
         * the panel inside shrink below its content height when the viewport is
         * short — flex shrinking, rather than a percentage `max-height` that
         * only works when the grid area resolves to a definite size.
         */}
        <div className="flex min-h-0 flex-col">{filters}</div>

        <Panel
          className={cn(
            "flex h-full min-h-0 flex-col gap-inset",
            expanded && "hidden lg:flex",
          )}
        >
          {children}
        </Panel>
      </div>
    </FiltersContext>
  );
}
