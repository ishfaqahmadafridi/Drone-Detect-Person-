import { TacticalNavTab } from "../index";

// ==========================================
// 11. Tactical Views & Viewport Router Props
// ==========================================
export interface AirspaceCommandViewProps {
  onSnapshotTrigger: () => void;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
  onTabChange?: (tab: TacticalNavTab) => void;
}

export interface IncidentAuditViewProps {
  className?: string;
}

export interface CalibrationViewProps {
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
}

export interface TacticalViewRouterProps {
  activeTab: TacticalNavTab;
  onSnapshotTrigger: () => void;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
  onTabChange?: (tab: TacticalNavTab) => void;
}

export interface MissionCommandViewportProps {
  activeTab: TacticalNavTab;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  onRefresh: () => void;
  onSnapshotTrigger?: () => void;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
  onTabChange?: (tab: TacticalNavTab) => void;
}

