'use client';

import { GetEventListQuery } from "@/app/__generated__/graphql";
import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./navigation/styles.module.css";
import { useCallback } from "react";

type NormalPage = {
  label: string,
  path: string,
};

type DropdownPage = {
  label: string,
  menu: NormalPage[],
}

type DiscriminatedUnion<K extends PropertyKey, T extends object> = {
  [P in keyof T]: ({ [Q in K]: P } & T[P]) extends infer U ? { [Q in keyof U]: U[Q] } : never
}[keyof T];

type Page = DiscriminatedUnion<"type", {
  normal: NormalPage,
  dropdown: DropdownPage,
  separator: {},
}>;

function cleanUpHandle(eventHandle: string) {
  return eventHandle.split('_').map((word) => {
    return word.charAt(0).toLowerCase() + word.slice(1);
  }).join(' ');
}

const pages = (events: GetEventListQuery) => [
  {
    type: "normal",
    label: "Home",
    path: "/latest",
  },
  {
    type: "dropdown",
    label: "Events",
    menu: events.events.map((event) => ({
      label: cleanUpHandle(event.handle),
      path: `/event/${event.handle}/${event.lastEdition?.id}`,
    })),
  },
  { type: "separator" },
  {
    type: "normal",
    label: "Resources",
    path: "/links"
  },
] as Page[];

export default function Navigation({
  events
}: {
  events: GetEventListQuery,
}) {
  const pathname = usePathname();
  const isActive = useCallback((link: string) => {
    return pathname === link;
  }, [pathname]);
  const toggleActiveClass = (link: string) => isActive(link) ? "active" : undefined;

  return (
    <nav>
      <input type="checkbox" name="menu_opened" id="menu_opened" />
      <div id="logo">
        <Link href="/">Obstacle</Link>
      </div>

      <div id="burger">
        <label htmlFor="menu_opened">☰</label>
      </div>

      <ul>
        {pages(events).map((page, i) => page.type === "separator" ? (
          <li key={`sep_${i}`} className="separator"></li>
        ) : page.type === "normal" ? (
          <li key={page.path}>
            <Link
              href={page.path}
              className={toggleActiveClass(page.path)}
            >
              {page.label}
            </Link>
          </li>
        ) : (
          <li key={page.label} className={css.dropdown}>
            <span
              className={`${css.dropbtn} ${page.menu.some((link) => isActive(link.path))
                ? "active" : undefined
                }`}
            >
              {page.label}
            </span>
            <div className={css.dropdownContentWrapper}>
              <div className={css.dropdownContent}>
                {page.menu.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={toggleActiveClass(link.path)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}