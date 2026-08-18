import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { NAV_PAGES, type NavKey } from "./pages";
import ThemeToggle from "./ThemeToggle";

/** The icon rail, pinned to the left edge from `md` up. */
export default function SidebarNav({ selected }: { selected?: NavKey }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-s-2 top-2 z-50 hidden h-[calc(100%-1rem)] w-[calc(var(--logo-size)+var(--panel-inset)*2)] flex-col items-center gap-5 rounded-bar bg-card p-inset backdrop-blur-sm md:flex"
    >
      <Link href="/" aria-label="Home">
        <Logo />
      </Link>

      <Separator className="bg-foreground/90 h-0.75 rounded-full" />

      <ul className="flex flex-col items-center gap-5">
        {Object.entries(NAV_PAGES).map(([key, page]) => {
          const Icon = page.icon;
          const isSelected = key === selected;

          return (
            <li key={key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={page.route}
                    aria-current={isSelected ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-center transition-colors hover:text-primary",
                      isSelected ? "text-primary" : "text-foreground",
                    )}
                  >
                    <Icon className="size-[calc(var(--logo-size)-1rem)]" />
                    <span className="sr-only">{page.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{page.title}</TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>

      {/* Pinned to the foot of the rail: a setting, not one of the pages. */}
      <ThemeToggle
        tooltipSide="right"
        className="mt-auto mb-4 justify-center"
        iconClassName="size-[calc(var(--logo-size)-1.75rem)]"
      />
    </nav>
  );
}
