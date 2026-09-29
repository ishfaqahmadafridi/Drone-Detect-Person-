import { NavItemConfig } from "@/types";
import {
  Crosshair,
  LayoutGrid,
  Navigation,
  ShieldAlert,
  Compass,
  Sliders,
  Film,
} from "lucide-react";

export const NAV_ITEMS: readonly NavItemConfig[] = [
  { id: "airspace",    label: "Tactical Airspace",  icon: Crosshair  },
  { id: "cameras",     label: "Multi-Camera Wall",  icon: LayoutGrid },
  { id: "avionics",    label: "Flight Avionics",    icon: Navigation },
  { id: "incidents",   label: "Incident Audits",    icon: ShieldAlert },
  { id: "recordings",  label: "Evidence Records",   icon: Film       },
  { id: "geofence",    label: "Restricted Zones",   icon: Compass    },
  { id: "settings",    label: "Sensor Calibration", icon: Sliders    },
] as const;
