import { Suspense } from "react";

import { cn } from "@/lib/utils";

/**
 * Wraps a page whose lists select rows: the page keeps the room it had, and the
 * selection takes a column of its own beside it — pushing the page over rather
 * than covering it. Nothing is reserved while nothing is selected.
 *
 * A `centered` page is capped at the content width and centered together with
 * its column, so the column opens right against it instead of out at the edge
 * of the screen. Without it, the page fills whatever the column leaves.
 *
 * The aside reads the selection from the query string, so it needs nothing
 * passed down from the list that made it — hence the `Suspense` around it.
 * It keeps its own distance from the page (see `DetailColumn`), so a closed
 * column takes no room at all, not even a gap.
 */
export default function WithDetailAside({
  aside,
  centered = false,
  children,
}: React.PropsWithChildren<{ aside: React.ReactNode; centered?: boolean }>) {
  return (
    <div className={cn("flex h-full min-h-0", centered && "justify-center")}>
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col",
          centered && "max-w-content",
        )}
      >
        {children}
      </div>

      <Suspense>{aside}</Suspense>
    </div>
  );
}
