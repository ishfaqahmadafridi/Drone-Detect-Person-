import { NavItemConfig, TacticalNavTab } from "@/types";
import {
  Radio,
  Camera,
  FileText,
  Film,
  Sliders,
} from "lucide-react";

export const TAB_ROUTE_MAP: Record<TacticalNavTab, string> = {
  airspace: "/drone",
  cameras: "/cameras",
  incidents: "/incidents",
  recordings: "/recordings",
  settings: "/settings",
};

export const ROUTE_TAB_MAP: Record<string, TacticalNavTab> = {
  "/drone": "airspace",
  "/airspace": "airspace",
  "/cameras": "cameras",
  "/incidents": "incidents",
  "/recordings": "recordings",
  "/settings": "settings",
  "/": "airspace",
};

export const NAV_ITEMS: readonly NavItemConfig[] = [
  { id: "airspace",   label: "Airspace Command",   href: "/drone",      icon: Radio    },
  { id: "cameras",    label: "Perimeter Cameras",  href: "/cameras",    icon: Camera   },
  { id: "incidents",  label: "Incident Logs",      href: "/incidents",  icon: FileText },
  { id: "recordings", label: "Recordings",         href: "/recordings", icon: Film     },
  { id: "settings",   label: "Settings",           href: "/settings",   icon: Sliders  },
] as const;
