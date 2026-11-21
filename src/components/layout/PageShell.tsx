import { cn } from "@/lib/utils";
import type { NavKey } from "./pages";
import SidebarNav from "./SidebarNav";
import TitleBar from "./TitleBar";

/**
 * Frame shared by every page: the icon rail, the floating title bar, and a
 * content area that fills the rest of the viewport. Pages scroll inside their
 * own panels rather than moving the frame.
 */
export default function PageShell({
  selectedMenu,
  titleSegments,
  className,
  children,
}: React.PropsWithChildren<{
  titleSegments: React.ReactNode[];
  selectedMenu?: NavKey;
  className?: string;
}>) {
  return (
    // On touch devices the page runs under the browser's own chrome
    // (`viewportFit: "cover"`), so the padding grows to clear the toolbar and
    // notch, and the document is taller than the screen and scrolled under
    // iOS Safari's toolbar (see `ToolbarBleed`): the shell sticks to the top
    // at one screen's height and still reads as a fixed frame.
    <div
      data-page-shell
      className="flex h-full min-h-0 shrink-0 overflow-hidden p-2 pointer-coarse:sticky pointer-coarse:top-0 pointer-coarse:h-svh pointer-coarse:pt-[max(0.5rem,env(safe-area-inset-top))] pointer-coarse:pr-[max(0.5rem,env(safe-area-inset-right))] pointer-coarse:pb-[max(0.5rem,env(safe-area-inset-bottom))] pointer-coarse:pl-[max(0.5rem,env(safe-area-inset-left))]">
      <SidebarNav selected={selectedMenu} />

      {/* `min-h-0` so this column can shrink past its content: without it a
          short viewport pushes the page past the bottom of the window, where
          the shell's `overflow-hidden` clips it out of reach. */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 md:ms-[calc(var(--logo-size)+1.5rem)]">
        {/* In the flow rather than fixed over the page: whatever height the
            bar ends up at, the content starts below it instead of under it. */}
        <TitleBar segments={titleSegments} selected={selectedMenu} />

        <main className={cn("flex min-h-0 flex-1 flex-col", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
