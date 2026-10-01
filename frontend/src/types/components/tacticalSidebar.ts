import { TacticalNavTab, ThreatLevel, DroneAvionics } from "../index";

// ==========================================
// 10. Tactical Sidebar Component Props
// ==========================================
export interface TacticalSidebarProps {
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenWall?: () => void;
  avionics?: DroneAvionics;
  isMuted: boolean;
  onToggleMute: () => void;
  threatLevel: ThreatLevel;
  viewMode?: "aerial" | "ground";
  onViewSelect?: (view: "aerial" | "ground") => void;
}

export interface SidebarPerspectiveToggleProps {
  viewMode: "aerial" | "ground";
  onViewSelect: (view: "aerial" | "ground") => void;
  isCollapsed: boolean;
}

export interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  flightState: string;
  isAirborne: boolean;
  viewMode?: "aerial" | "ground";
}

export interface SidebarNavListProps {
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  isCollapsed: boolean;
  threatLevel: ThreatLevel;
  onOpenWall?: () => void;
}

export interface NavItemConfig {
  id: TacticalNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SidebarNavItemProps {
  item: NavItemConfig;
  isActive: boolean;
  isCollapsed: boolean;
  threatLevel: ThreatLevel;
  onSelect: (id: TacticalNavTab) => void;
}

export interface SidebarCameraWallTriggerProps {
  isCollapsed: boolean;
  onOpenWall: () => void;
}

export interface SidebarTelemetryWidgetProps {
  batteryPct: number;
  isBatteryLow: boolean;
  altitude: number;
  speed: number;
  viewMode?: "aerial" | "ground";
}

export interface SidebarFooterProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isCollapsed: boolean;
}

export interface SidebarTopSectionProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  flightState: string;
  isAirborne: boolean;
  viewMode?: "aerial" | "ground";
  onViewSelect?: (view: "aerial" | "ground") => void;
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  onOpenWall?: () => void;
  threatLevel: ThreatLevel;
}

export interface SidebarBottomSectionProps {
  isCollapsed: boolean;
  batteryPct: number;
  isBatteryLow: boolean;
  altitude: number;
  speed: number;
  viewMode?: "aerial" | "ground";
  isMuted: boolean;
  onToggleMute: () => void;
}
