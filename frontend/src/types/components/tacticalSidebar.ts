import { TacticalNavTab, ThreatLevel } from "../index";

// ==========================================
// 10. Tactical Sidebar Component Props
// ==========================================
export interface TacticalSidebarProps {
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  threatLevel: ThreatLevel;
  viewMode?: "aerial" | "ground";
  onViewSelect?: (view: "aerial" | "ground") => void;
}

export interface SidebarPerspectiveToggleProps {
  viewMode: "aerial" | "ground";
  onViewSelect: (view: "aerial" | "ground") => void;
  isCollapsed: boolean;
}

export interface SidebarNavListProps {
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  isCollapsed: boolean;
  threatLevel: ThreatLevel;
  viewMode: "aerial" | "ground";
}

export interface NavItemConfig {
  id: TacticalNavTab;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SidebarNavItemProps {
  item: NavItemConfig;
  isActive: boolean;
  isCollapsed: boolean;
  threatLevel: ThreatLevel;
  onSelect: (id: TacticalNavTab) => void;
}

export interface SidebarTopSectionProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  viewMode?: "aerial" | "ground";
  onViewSelect?: (view: "aerial" | "ground") => void;
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  threatLevel: ThreatLevel;
}

export interface SidebarBottomSectionProps {
  isCollapsed: boolean;
}

export interface SidebarSystemHealthProps {
  isCollapsed?: boolean;
}

