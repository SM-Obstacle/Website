import { AlertTriangle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  LeaderboardBody,
  LeaderboardCell,
  LeaderboardRow,
} from "./Leaderboard";

export function TableSkeleton({
  rows = 12,
  columns,
}: {
  rows?: number;
  columns: number;
}) {
  return (
    <LeaderboardBody>
      {Array.from({ length: rows }, (_, row) => (
        <LeaderboardRow key={row}>
          {Array.from({ length: columns }, (_, column) => (
            <LeaderboardCell key={column}>
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
  children,
  className,
}: React.PropsWithChildren<{ columns: number; className?: string }>) {
  return (
    <LeaderboardBody>
      <LeaderboardRow className="hover:[&>td]:bg-transparent">
        <LeaderboardCell
          colSpan={columns}
          className={cn("py-10 text-center text-muted-foreground", className)}
        >
          {children}
        </LeaderboardCell>
      </LeaderboardRow>
    </LeaderboardBody>
  );
}

export function TableError({
  columns,
  message,
}: {
  columns: number;
  message?: string;
}) {
  return (
    <TableMessage columns={columns} className="text-destructive">
      <span className="inline-flex items-center gap-2">
        <AlertTriangle className="size-4" />
        {message || "Something went wrong while loading this list."}
      </span>
    </TableMessage>
  );
}
