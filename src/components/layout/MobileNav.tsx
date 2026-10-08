"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import MappackSearch from "./MappackSearch";
import { NAV_PAGES, type NavKey } from "./pages";
import ThemeToggle from "./ThemeToggle";

/** Below `md` the rail collapses into a drawer opened from the title bar logo. */
export default function MobileNav({ selected }: { selected?: NavKey }) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger
        aria-label="Open navigation"
        className="cursor-pointer md:hidden"
      >
        <Logo />
      </DrawerTrigger>

      <DrawerContent className="rounded-block border-0 bg-card p-inset backdrop-blur-md">
        <DrawerHeader className="p-0">
          <DrawerTitle className="flex items-center gap-3">
            <Logo width={36} height={36} />
            Obstacle
          </DrawerTitle>
        </DrawerHeader>

        <nav aria-label="Main">
          <ul className="flex flex-col gap-1">
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
            <li>
              <MappackSearch withLabel />
            </li>
          </ul>
        </nav>

        {/* Below the pages, and outside the nav: a setting, not a destination. */}
        <ThemeToggle
          withLabel
          className="gap-3 rounded-full px-4 py-3 text-lg hover:bg-accent"
          iconClassName="size-5"
        />
      </DrawerContent>
    </Drawer>
  );
}
