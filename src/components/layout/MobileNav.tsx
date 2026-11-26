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
import LoadingLogo from "./LoadingLogo";
import Logo from "./Logo";
import MappackSearch from "./MappackSearch";
import { NAV_PAGES, type NavKey } from "./pages";
import ThemeToggle from "./ThemeToggle";

/**
 * One look for every row in the drawer, links and buttons alike, so they share
 * a height, an inset and a hover. Buttons bring their own font weight, border
 * and fixed height, hence the resets.
 */
const ITEM_CLASS =
  "flex h-auto w-full cursor-pointer items-center justify-start gap-3 rounded-full border-0 px-4 py-3 text-lg font-normal text-foreground transition-colors hover:bg-accent hover:text-foreground";

/** Below `md` the rail collapses into a drawer opened from the title bar logo. */
export default function MobileNav({ selected }: { selected?: NavKey }) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="left">
      <DrawerTrigger
        aria-label="Open navigation"
        className="cursor-pointer md:hidden"
      >
        <LoadingLogo />
      </DrawerTrigger>

      <DrawerContent className="rounded-r-block data-[swipe-direction=left]:rounded-r-block border-0 bg-card backdrop-blur-sm">
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <DrawerHeader className="px-2 py-0">
            <DrawerTitle className="flex items-center gap-3 text-xl font-semibold">
              <Logo width={36} height={36} />
              Obstacle
            </DrawerTitle>
          </DrawerHeader>

          <nav aria-label="Main">
            <ul className="flex flex-col gap-1.5">
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
                        ITEM_CLASS,
                        isSelected &&
                          "bg-accent text-primary hover:text-primary",
                      )}
                    >
                      <Icon className="size-5 shrink-0" />
                      {page.title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <MappackSearch withLabel className={ITEM_CLASS} />
              </li>
            </ul>
          </nav>

          {/* Pinned to the bottom, and outside the nav: a setting, not a destination. */}
          <div className="mt-auto border-t border-border pt-4">
            <ThemeToggle
              withLabel
              className={ITEM_CLASS}
              iconClassName="size-5 shrink-0"
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
