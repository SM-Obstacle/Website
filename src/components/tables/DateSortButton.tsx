"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/useUrlParams";
import { PAGINATION_KEYS } from "@/lib/pagination";

/**
 * Flips the date ordering of a list through the query string.
 *
 * The arrow shows the order in effect; note that the API's `DESCENDING` walks
 * dates upwards, so `order=desc` is what puts the oldest records first.
 */
export default function DateSortButton({
  oldestFirst,
}: {
  oldestFirst: boolean;
}) {
  const { setParams } = useUrlParams();

  return (
    <Button
      variant="secondary"
      size="icon-sm"
      className="border border-transparent bg-sunken transition-colors hover:border-foreground"
      aria-label={oldestFirst ? "Show newest first" : "Show oldest first"}
      onClick={() =>
        setParams(
          { order: oldestFirst ? "asc" : "desc" },
          { remove: PAGINATION_KEYS },
        )
      }
    >
      {oldestFirst ? <ArrowUp /> : <ArrowDown />}
    </Button>
  );
}
