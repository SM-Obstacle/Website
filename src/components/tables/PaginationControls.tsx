"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/useUrlParams";
import type { PageInfo } from "@/lib/pagination";

export default function PaginationControls({
  pageInfo,
  disabled = false,
}: {
  pageInfo?: PageInfo;
  disabled?: boolean;
}) {
  const { setParams } = useUrlParams();

  const previousCursor = pageInfo?.hasPreviousPage ? pageInfo.startCursor : null;
  const nextCursor = pageInfo?.hasNextPage ? pageInfo.endCursor : null;

  const goTo = (direction: "before" | "after", cursor: string) => {
    setParams({
      [direction]: cursor,
      [direction === "before" ? "after" : "before"]: undefined,
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 p-3">
      <Button
        variant="secondary"
        size="icon-lg"
        className="rounded-full border border-transparent bg-black transition-colors enabled:hover:bg-white/10 active:border-white"
        aria-label="Previous page"
        disabled={disabled || !previousCursor}
        onClick={() => previousCursor && goTo("before", previousCursor)}
      >
        <ArrowLeft />
      </Button>

      <Button
        variant="secondary"
        size="icon-lg"
        className="rounded-full border border-transparent bg-black transition-colors enabled:hover:bg-white/10 active:border-white"
        aria-label="Next page"
        disabled={disabled || !nextCursor}
        onClick={() => nextCursor && goTo("after", nextCursor)}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}
