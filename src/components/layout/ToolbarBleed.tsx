"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Keeps the document scrolled into its bleed on touch devices, on pages with
 * the shell. iOS Safari 26 only shows page content behind its floating toolbar
 * once the page is scrolled; at the very top it paints a flat colour. The
 * offset is `--toolbar-scroll` in globals.css, which the drawer is placed by
 * too. The user cannot scroll the document (`overflow: hidden`), so any
 * scroll that moves it, such as Next resetting the scroll on navigation, is
 * undone straight away.
 */
export default function ToolbarBleed() {
  const pathname = usePathname();

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");

    const pin = () => {
      if (!coarse.matches || !document.querySelector("[data-page-shell]")) {
        return;
      }
      const offset = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--toolbar-scroll",
        ),
      );
      if (Number.isFinite(offset) && window.scrollY !== offset) {
        window.scrollTo({ top: offset, behavior: "instant" });
      }
    };

    pin();
    window.addEventListener("scroll", pin, { passive: true });
    window.addEventListener("resize", pin);
    coarse.addEventListener("change", pin);
    return () => {
      window.removeEventListener("scroll", pin);
      window.removeEventListener("resize", pin);
      coarse.removeEventListener("change", pin);
    };
  }, [pathname]);

  return null;
}
