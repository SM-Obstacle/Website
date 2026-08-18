import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

import MobileNav from "./MobileNav";
import type { NavKey } from "./pages";

export default function TitleBar({
  segments,
  selected,
}: {
  segments: React.ReactNode[];
  selected: NavKey;
}) {
  return (
    <div className="fixed inset-s-2 top-2 z-50 w-[calc(100%-1rem)] md:inset-s-[calc(var(--logo-size)+2rem)] md:w-[calc(100%-var(--logo-size)-2.5rem)]">
      <div className="flex min-h-[calc(var(--logo-size)+var(--panel-inset)*2)] w-full items-center gap-2 rounded-bar bg-card p-inset backdrop-blur-sm">
        <MobileNav selected={selected} />

        <div className="flex min-w-0 items-center gap-1 px-3 font-black">
          {segments.map((segment, i) => (
            <Fragment key={`segment-${i}`}>
              {i > 0 && (
                <ChevronRight className="size-5 shrink-0" aria-hidden />
              )}
              <div className="min-w-0">{segment}</div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
