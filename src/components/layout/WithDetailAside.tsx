import { Suspense } from "react";

/**
 * Wraps a page whose lists select rows: the page keeps the room it had, and the
 * selection takes a column of its own beside it — pushing the page over rather
 * than covering it. Nothing is reserved while nothing is selected.
 *
 * The aside reads the selection from the query string, so it needs nothing
 * passed down from the list that made it — hence the `Suspense` around it.
 */
export default function WithDetailAside({
  aside,
  children,
}: React.PropsWithChildren<{ aside: React.ReactNode }>) {
  return (
    <div className="flex h-full min-h-0 gap-inset">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>

      <Suspense>{aside}</Suspense>
    </div>
  );
}
