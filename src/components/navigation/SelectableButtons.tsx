"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { NavLink } from "../Link";
import { DropBtn, DropdownContentItem } from "./components";
import type { Page } from "./pages";

function useIsActive() {
  const pathname = usePathname();
  return useCallback((link: string) => pathname === link, [pathname]);
}

type PageOfType<T extends Page["type"]> = Omit<
  Page & {
    type: T;
  },
  "type"
>;

export function SelectableNavLink({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const isActive = useIsActive();
  return (
    <NavLink href={path} active={isActive(path)}>
      {children}
    </NavLink>
  );
}

export function SelectableDropdownButton({
  page,
  children,
}: {
  page: PageOfType<"dropdown">;
  children: React.ReactNode;
}) {
  const isActive = useIsActive();
  return (
    <DropBtn
      active={Object.values(page.menu).some((link) => isActive(link.path))}
    >
      {children}
    </DropBtn>
  );
}

export function SelectableDropdownItemButton({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const isActive = useIsActive();
  return (
    <DropdownContentItem href={path} active={isActive(path)}>
      {children}
    </DropdownContentItem>
  );
}
