import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * The leaderboard look shared by every ranking on the site: zebra striping,
 * a sticky header, and rows that never wrap.
 */
export function Leaderboard({
  className,
  ...props
}: React.ComponentProps<typeof Table>) {
  return (
    <Table
      // The container `Table` wraps itself in scrolls sideways, which makes it
      // the scrollport the sticky head would stick to — and it is as tall as
      // the table, so it never scrolls and the head never sticks. Nothing here
      // overflows sideways to begin with: the layout is fixed and the cells
      // that would elide instead. Handing the head back to whatever scrolls the
      // table is what keeps it in place.
      containerClassName="overflow-x-visible"
      className={cn("mx-5 my-2 w-[calc(100%-2.5rem)] table-fixed", className)}
      {...props}
    />
  );
}

export function LeaderboardHeader({
  className,
  ...props
}: React.ComponentProps<typeof TableHeader>) {
  return (
    <TableHeader
      className={cn(
        "sticky top-2 backdrop-blur-[calc(var(--blur-xs)/2)] z-10 text-base [&_tr]:border-0 [&_th]:bg-sunken-opaque",
        className,
      )}
      {...props}
    />
  );
}

export const LeaderboardBody = TableBody;

export function LeaderboardRow({
  className,
  ...props
}: React.ComponentProps<typeof TableRow>) {
  return (
    <TableRow
      className={cn(
        "border-0 hover:bg-transparent",
        "[&>td]:transition-colors [&>td]:first:rounded-s-md [&>td]:last:rounded-e-md",
        "even:[&>td]:bg-muted hover:[&>td]:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

export function LeaderboardHead({
  className,
  ...props
}: React.ComponentProps<typeof TableHead>) {
  return (
    <TableHead
      className={cn(
        "h-auto px-1 py-1 text-left font-bold text-foreground first:rounded-s-md last:rounded-e-md",
        className,
      )}
      {...props}
    />
  );
}

export function LeaderboardCell({
  className,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return <TableCell className={cn("px-1 py-1", className)} {...props} />;
}

/** Cell whose content is elided rather than pushing the table wider. */
export function NameCell({
  className,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return <LeaderboardCell className={cn("truncate", className)} {...props} />;
}

export function RankCell({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return (
    <LeaderboardCell className={cn("text-right", className)} {...props}>
      <code>{children}</code>
    </LeaderboardCell>
  );
}

export function TimeCell({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return (
    <LeaderboardCell
      className={cn("font-bold text-time italic", className)}
      {...props}
    >
      <code>{children}</code>
    </LeaderboardCell>
  );
}

/** Secondary column, dropped on the narrow layout. */
export function WideOnlyCell({
  className,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return (
    <LeaderboardCell
      className={cn("hidden md:table-cell", className)}
      {...props}
    />
  );
}

export function WideOnlyHead({
  className,
  ...props
}: React.ComponentProps<typeof TableHead>) {
  return (
    <LeaderboardHead
      className={cn("hidden md:table-cell", className)}
      {...props}
    />
  );
}
