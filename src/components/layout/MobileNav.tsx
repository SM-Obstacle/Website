"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { NAV_PAGES, type NavKey } from "./pages";
import ThemeToggle from "./ThemeToggle";

/** Below `md` the rail collapses into a sheet opened from the title bar logo. */
export default function MobileNav({ selected }: { selected?: NavKey }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open navigation"
        className="cursor-pointer md:hidden"
      >
        <Logo />
      </SheetTrigger>

      {/* Stands in for the sidebar rail, so it carries the same bar radius. */}
      <SheetContent
        side="left"
        className="w-64 rounded-e-bar border-0 bg-card p-inset backdrop-blur-md"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <Logo width={36} height={36} />
            Obstacle
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Main">
          <ul className="flex flex-col gap-1 px-2">
            {Object.entries(NAV_PAGES).map(([key, page]) => {
              const Icon = page.icon;
              const isSelected = key === selected;

              return (
                <li key={key}>
                  <Link
                    href={page.route}
                    onClick={() => setOpen(false)}
                    aria-current={isSelected ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-4 py-3 text-lg transition-colors hover:bg-accent",
                      isSelected && "text-primary",
                    )}
                  >
                    <Icon className="size-5" />
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Below the pages, and outside the nav: a setting, not a destination. */}
        <ThemeToggle
          withLabel
          className="mx-2 gap-3 rounded-full px-4 py-3 text-lg hover:bg-accent"
          iconClassName="size-5"
        />
      </SheetContent>
    </Sheet>
  );
}
