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
    <div className="flex h-full min-h-0 overflow-hidden p-2">
      <SidebarNav selected={selectedMenu} />

      {/* `min-h-0` so this column can shrink past its content: without it a
          short viewport pushes the page past the bottom of the window, where
          the shell's `overflow-hidden` clips it out of reach. */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:ms-[calc(var(--logo-size)+1.5rem)]">
        <TitleBar segments={titleSegments} selected={selectedMenu} />

        <main
          className={cn(
            "mt-[calc(var(--logo-size)+1.5rem)] flex min-h-0 flex-1 flex-col",
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
