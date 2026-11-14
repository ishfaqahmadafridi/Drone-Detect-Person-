import { NavItemConfig, TacticalNavTab } from "@/types";
import { Radar, Cctv, Cable, FileText, Film, Settings } from "lucide-react";
import { COMMAND_VIEW_TITLES } from "./tactical";

export const TAB_ROUTE_MAP: Record<TacticalNavTab, string> = {
  airspace: "/drone",
  connections: "/connections",
  cameras: "/cameras",
  incidents: "/incidents",
  recordings: "/recordings",
  settings: "/settings",
};

export const ROUTE_TAB_MAP: Record<string, TacticalNavTab> = {
  "/drone": "airspace",
  "/airspace": "airspace",
  "/connections": "connections",
  "/cameras": "cameras",
  "/incidents": "incidents",
  "/recordings": "recordings",
  "/settings": "settings",
  "/": "airspace",
};

export const NAV_ITEMS: readonly NavItemConfig[] = [
  { id: "airspace",   label: "Airspace Command",   href: "/drone",      icon: Radar    },
  { id: "connections", label: "Connections",        href: "/connections", icon: Cable },
  { id: "incidents",  label: "Incident Logs",      href: "/incidents",  icon: FileText },
  { id: "recordings", label: "Recordings",         href: "/recordings", icon: Film     },
  { id: "settings",   label: "Settings",           href: "/settings",   icon: Settings  },
] as const;

/** The live command page follows the selected perspective, so its menu entry does too. */
export const COMMAND_NAV = {
  aerial: { label: COMMAND_VIEW_TITLES.aerial, icon: Radar },
  ground: { label: COMMAND_VIEW_TITLES.ground, icon: Cctv },
} as const;
