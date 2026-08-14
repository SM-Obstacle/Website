import {
  BookOpen,
  CalendarDays,
  Footprints,
  Home,
  Map,
  Users,
} from "lucide-react";

export interface NavPage {
  title: string;
  route: string;
  icon: React.ElementType;
}

export const NAV_PAGES = {
  home: { title: "Home", route: "/", icon: Home },
  records: { title: "Records", route: "/records", icon: Footprints },
  maps: { title: "Maps", route: "/maps", icon: Map },
  players: { title: "Players", route: "/players", icon: Users },
  events: { title: "Events", route: "/events", icon: CalendarDays },
  resources: { title: "Resources", route: "/links", icon: BookOpen },
} satisfies Record<string, NavPage>;

export type NavKey = keyof typeof NAV_PAGES;
