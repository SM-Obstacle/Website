"use client";

import { CircleHelp } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * A "?" button that opens the explanation of a ranking.
 *
 * A dialog rather than a tooltip: the text runs to several paragraphs and
 * formulas, and a tooltip has no hover to open it on a phone. The content is
 * rendered on the server and handed in as children (see `RankingDoc`).
 */
export default function RankingHelpDialog({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={title}
        title={title}
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary sm:size-10"
      >
        <CircleHelp className="size-5 sm:size-6" aria-hidden />
      </DialogTrigger>

      <DialogContent className="max-h-[85dvh] gap-inset rounded-block bg-popover p-inset sm:max-w-2xl">
        <DialogHeader className="px-3 pe-10 pt-2">
          <DialogTitle className="text-xl font-black">{title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="min-h-0 rounded-panel">
          {/* Wide display formulas scroll sideways on their own instead of
              widening the dialog; the vertical padding keeps the scrollbar
              from clipping tall fractions and sums. They are set a little
              smaller on phones, so more of each fits before it scrolls. */}
          <div className="px-3 pb-3 text-base *:first:mt-0 [&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1 [&_.katex-display]:text-[0.8em] sm:[&_.katex-display]:text-[1em]">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
