import Image from "next/image";
import Link from "next/link";
import { FaHome, FaRunning } from "react-icons/fa";
import { FaBook, FaCalendar, FaMap, FaUsers } from "react-icons/fa6";
import { css } from "../../@shadow-panda/styled-system/css";
import Bar from "./ui/Bar";

function Logo() {
  return (
    <Image
      alt="ShootMania Obstacle logo"
      src="/img/obs_logo.svg"
      width={50}
      height={50}
    />
  );
}

function Separator() {
  return (
    <hr
      className={css({
        border: "none",
        height: "3px",
        borderRadius: "token(radii.full)",
        color: "white",
        bgColor: "white",
        width: "100%",
      })}
    />
  );
}

function MenuItem({ page, isSelected }: { page: Page; isSelected: boolean }) {
  const IconType = page.iconType;
  return (
    <Link
      href={page.route}
      title={page.title}
      className={css({
        textDecoration: "none",
        color: isSelected ? "token(colors.blue.500)" : "token(colors.white)",
        fontSize: "calc(token(sizes.logoSize) - token(spacing.2) * 2)",
        transition: "color 0.5s",
      })}
    >
      <IconType />
    </Link>
  );
}

function Menu({
  pages,
  selectedKey,
}: {
  pages: Record<string, Page>;
  selectedKey: string;
}) {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        gap: 5,
      })}
    >
      {Object.entries(pages).map(([key, page]) => (
        <MenuItem page={page} isSelected={key === selectedKey} key={key} />
      ))}
    </div>
  );
}

interface Page {
  title: string;
  route: string;
  iconType: React.ElementType;
}

const pages = {
  home: {
    title: "Home",
    route: "/",
    iconType: FaHome,
  },
  records: {
    title: "Records",
    route: "/records",
    iconType: FaRunning,
  },
  maps: {
    title: "Maps",
    route: "/maps",
    iconType: FaMap,
  },
  players: {
    title: "Players",
    route: "/players",
    iconType: FaUsers,
  },
  events: {
    title: "Events",
    route: "/events",
    iconType: FaCalendar,
  },
  resources: {
    title: "Resources",
    route: "/links",
    iconType: FaBook,
  },
} satisfies Record<string, Page>;

export default function NavigationSideBar({
  selected,
}: {
  selected: keyof typeof pages;
}) {
  return (
    <Bar orientation="vertical">
      <div
        className={css({
          display: "flex",
          flexDir: "column",
          gap: "20px",
          alignItems: "center",
        })}
      >
        <Logo />
        <Separator />
        <Menu pages={pages} selectedKey={selected} />
      </div>
    </Bar>
  );
}
