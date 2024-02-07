'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  {
    label: "Home",
    path: "/latest",
  },
  {
    label: "Campaign",
    path: "/event/campaign/1",
  },
  "separator",
  {
    label: "Resources",
    path: "/links"
  }
];

export default function Navigation() {
  const pathname = usePathname();

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
        {pages.map((page, i) => typeof page === "string" ? (
          <li key={`sep_${i}`} className="separator"></li>
        ) : (
          <li key={page.path}>
            <Link
              href={page.path}
              className={pathname.startsWith(`/${page.path.split('/')[1]}`) ? "active" : undefined}
            >
              {page.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}