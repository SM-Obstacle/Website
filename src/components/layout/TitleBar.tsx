import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

import MobileNav from "./MobileNav";
import type { NavKey } from "./pages";

export default function TitleBar({
  segments,
  selected,
  actions,
}: {
  segments: React.ReactNode[];
  selected?: NavKey;
  /** Buttons pinned to the right end of the bar. */
  actions?: React.ReactNode;
}) {
  return (
    // A fixed height, one logo plus its inset: the title truncates rather than
    // wrapping, so the logo keeps the same padding on every side.
    <div className="z-40 flex h-[calc(var(--logo-size)+var(--panel-inset)*2)] w-full shrink-0 items-center gap-2 overflow-hidden rounded-bar bg-card p-inset backdrop-blur-sm">
      <MobileNav selected={selected} />

      <div className="flex min-w-0 items-center gap-1 px-2 font-black sm:px-3">
        {segments.map((segment, i) => (
          <Fragment key={`segment-${i}`}>
            {i > 0 && (
              <ChevronRight className="size-4 shrink-0 sm:size-5" aria-hidden />
            )}
            <div className="min-w-0">{segment}</div>
          </Fragment>
        ))}
      </div>

      {actions && (
        <div className="ms-auto flex shrink-0 items-center gap-1 me-1 md:me-2">
          {actions}
        </div>
      )}
    </div>
  );
}
