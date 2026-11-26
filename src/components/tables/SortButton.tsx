"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type ParamUpdates, useSetUrlParams } from "@/hooks/useUrlParams";
import { PAGINATION_KEYS } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/**
 * A column's sort toggle, writing the query string it is given.
 *
 * `direction` is the order this column is sorted in, if the list is sorted by
 * it at all: the arrow shows it, and a column the list isn't sorted by gets a
 * dimmed double arrow instead. Changing the order invalidates the cursors, so
 * the pagination is dropped with it.
 */
export default function SortButton({
  direction,
  label,
  params,
}: {
  direction?: "asc" | "desc";
  /** What a click does, e.g. "Show the slowest times first". */
  label: string;
  /** The params a click writes; `null` removes one. */
  params: ParamUpdates;
}) {
  const setParams = useSetUrlParams();

  return (
    <Button
      variant="secondary"
      size="icon-sm"
      className={cn(
        "border border-transparent bg-sunken transition-colors hover:border-foreground",
        !direction && "text-muted-foreground",
      )}
      aria-label={label}
      title={label}
      onClick={() => setParams(params, { remove: PAGINATION_KEYS })}
    >
      {direction === "asc" ? (
        <ArrowUp />
      ) : direction === "desc" ? (
        <ArrowDown />
      ) : (
        <ArrowUpDown />
      )}
    </Button>
  );
}
