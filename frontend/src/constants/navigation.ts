import { NavItemConfig } from "@/types";
import {
  Radio,
  Camera,
  FileText,
  Film,
  Sliders,
} from "lucide-react";

export const NAV_ITEMS: readonly NavItemConfig[] = [
  { id: "airspace",   label: "Aerial View",        icon: Radio    },
  { id: "cameras",    label: "Perimeter Cameras",  icon: Camera   },
  { id: "incidents",  label: "Incident Logs",      icon: FileText },
  { id: "recordings", label: "Recordings",         icon: Film     },
  { id: "settings",   label: "Settings",           icon: Sliders  },
] as const;

