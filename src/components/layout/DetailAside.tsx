"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Panel } from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Tailwind's `xl`: below it the panel would leave the list nothing to live on. */
export const WIDE_ENOUGH_FOR_A_PANEL = "(min-width: 80rem)";

/**
 * What a selected row opens beside the page: its name and whatever it belongs
 * to in the header, and everything else scrolling underneath.
 */
export function DetailPanel({
  title,
  subtitle,
  closeLabel,
  onClose,
  children,
}: React.PropsWithChildren<{
  title: React.ReactNode;
  subtitle: React.ReactNode;
  closeLabel: string;
  onClose: () => void;
}>) {
  return (
    <Panel
      // Only as tall as its contents need, and never taller than the column it
      // has: `min-h-0` lets the flex column above shrink it past that content,
      // and the details then scroll inside.
      className="min-h-0 overflow-hidden"
      header={
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="m-0 truncate text-xl font-bold">{title}</h2>
            {/* A div, not a p: the placeholder it holds while loading is a
                block, which a paragraph may not contain. */}
            <div className="truncate text-sm text-muted-foreground">
              {subtitle}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={onClose}
            aria-label={closeLabel}
            className="-me-1 shrink-0 rounded-full cursor-pointer"
          >
            <X />
          </Button>
        </div>
      }
    >
      {/* Rounded like a sub-panel so what scrolls is clipped along the same
          curve as the panel around it. */}
      <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-inset overflow-y-auto rounded-panel">
        {children}
      </div>
    </Panel>
  );
}

/**
 * The column the panel lives in. It stays mounted so both its width and the
 * panel's own offset can be transitioned: the width is what pushes the page
 * over, the offset is what slides the panel in from the edge of the screen.
 *
 * `children` is called with the selection to draw, which lags the real one
 * while the column slides back out.
 */
export function DetailColumn({
  selected,
  children,
}: {
  selected: string | null;
  children: (selected: string | null) => React.ReactNode;
}) {
  const open = selected !== null;

  // Keeps the selection on screen while the column slides back out, instead of
  // emptying it to skeletons halfway through.
  const [sliding, setSliding] = useState(selected);
  if (selected !== null && selected !== sliding) {
    setSliding(selected);
  }

  return (
    <aside
      inert={!open}
      className={cn(
        "flex min-h-0 shrink-0 flex-col overflow-visible",
        "transition-[width] duration-300 ease-out motion-reduce:transition-none",
        open ? "w-80 2xl:w-96" : "w-0",
      )}
    >
      {/* Its own width never changes, so anything measured inside it isn't
          re-measured on every frame of the slide — only the clipping around it
          moves. */}
      <div
        className={cn(
          "flex min-h-0 w-80 flex-col 2xl:w-96",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          !open && "translate-x-full",
        )}
      >
        {children(sliding)}
      </div>
    </aside>
  );
}
