import { Suspense } from "react";

import RecordAside from "./RecordAside";

/**
 * Wraps a page whose lists select records: the page keeps the room it had, and
 * the selected record takes a column of its own beside it — pushing the page
 * over rather than covering it. Nothing is reserved while nothing is selected.
 */
export default function WithRecordAside({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-full min-h-0 gap-inset">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>

      {/* The panel reads the selection from the query string. */}
      <Suspense>
        <RecordAside />
      </Suspense>
    </div>
  );
}
