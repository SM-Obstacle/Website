import { AlertTriangle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  LeaderboardBody,
  LeaderboardCell,
  LeaderboardRow,
} from "./Leaderboard";

/**
 * How many of a table's columns are dropped on the narrow layout, and from
 * which breakpoint up they show again.
 *
 * The placeholder rows have to match: a row with more cells than the header
 * shows — or a message spanning more columns than it — makes the table grow
 * an extra column with no header over it, and the visible headers stop short
 * of the table's right edge.
 */
type WideOnly = { wideOnly?: number; wideFrom?: "sm" | "md" };

// Spelled out in full so Tailwind sees every class.
const WIDE_ONLY = {
  sm: { cell: "hidden sm:table-cell", row: "hidden sm:table-row", narrowRow: "sm:hidden" },
  md: { cell: "hidden md:table-cell", row: "hidden md:table-row", narrowRow: "md:hidden" },
};

export function TableSkeleton({
  rows = 12,
  columns,
  wideOnly = 0,
  wideFrom = "md",
}: {
  rows?: number;
  columns: number;
} & WideOnly) {
  return (
    <LeaderboardBody>
      {Array.from({ length: rows }, (_, row) => (
        <LeaderboardRow key={row}>
          {Array.from({ length: columns }, (_, column) => (
            <LeaderboardCell
              key={column}
              className={cn(
                column >= columns - wideOnly && WIDE_ONLY[wideFrom].cell,
              )}
            >
              <Skeleton className="h-4 w-full" />
            </LeaderboardCell>
          ))}
        </LeaderboardRow>
      ))}
    </LeaderboardBody>
  );
}

export function TableMessage({
  columns,
  wideOnly = 0,
  wideFrom = "md",
  children,
  className,
}: React.PropsWithChildren<
  { columns: number; className?: string } & WideOnly
>) {
  const row = (span: number, rowClassName?: string) => (
    <LeaderboardRow
      className={cn("hover:[&>td]:bg-transparent", rowClassName)}
    >
      <LeaderboardCell
        colSpan={span}
        className={cn("py-10 text-center text-muted-foreground", className)}
      >
        {children}
      </LeaderboardCell>
    </LeaderboardRow>
  );

  // `colSpan` cannot follow a media query, so a table that drops columns gets
  // one row per layout, each spanning exactly the columns it shows.
  return (
    <LeaderboardBody>
      {wideOnly > 0 ? (
        <>
          {row(columns - wideOnly, WIDE_ONLY[wideFrom].narrowRow)}
          {row(columns, WIDE_ONLY[wideFrom].row)}
        </>
      ) : (
        row(columns)
      )}
    </LeaderboardBody>
  );
}

export function TableError({
  message,
  ...props
}: { columns: number; message?: string } & WideOnly) {
  return (
    <TableMessage {...props} className="text-destructive">
      <span className="inline-flex items-center gap-2">
        <AlertTriangle className="size-4" />
        {message || "Something went wrong while loading this list."}
      </span>
    </TableMessage>
  );
}
