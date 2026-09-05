"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  // `auto` rather than Radix's `hover`: the bar stands for what the native one
  // used to say — that there is more below — and it can't say it from behind a
  // pointer the visitor hasn't moved yet.
  type = "auto",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      type={type}
      // A column rather than shadcn's plain box, and the viewport a flex child
      // rather than `size-full`: most of these areas are sized by the flex
      // column they sit in — a panel between a header and a footer — and a
      // height that flexing settled is not one a percentage can resolve
      // against, so `h-full` would leave the viewport at its content's height
      // and spill it out of the panel instead of scrolling.
      className={cn("relative flex flex-col", className)}
      {...props}
    >
      {/* Radix wraps what it is given in a `display: table` box, which shrinks
          to its contents and swallows any height a child asks of it. A column
          at least as tall as the viewport instead, so content that fills the
          area it is given — a grid of panels, a centred message — can say so
          with `grow` and still scroll once it outgrows it. */}
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="w-full min-h-0 flex-1 rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 [&>div]:!flex [&>div]:min-h-full [&>div]:flex-col"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      {/* `--border` only ever draws a hairline against a panel; a thumb has to
          read over whatever it happens to cross. */}
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-foreground/20 transition-colors hover:bg-foreground/35"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
