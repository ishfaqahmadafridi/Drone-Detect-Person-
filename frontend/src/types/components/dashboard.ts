import type { ViewportAction } from "./viewport";
import { TacticalNavTab, ThreatLevel } from "../index";
import { CameraWallModalProps } from "./cameraWall";

// ==========================================
// 12. Tactical Dashboard Orchestrator & Workspace Props
// ==========================================
export interface TacticalWorkspaceProps {
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenWall: () => void;
  threatLevel: ThreatLevel;
  viewMode: "aerial" | "ground";
  onViewSelect: (view: "aerial" | "ground") => void;
  onSnapshotTrigger: ViewportAction;
}

export interface TacticalOverlaysProps {
  wall: {
    isWallOpen: boolean;
    activeSource: string;
    activeCameraId?: string;
    connectedCameraIds?: string[];
    closeWall: () => void;
    selectFeed: CameraWallModalProps["onSelectFeed"];
    toggleConnect: (cameraId: string) => void;
    connectAll: () => void;
    setLayout: (layout: "single" | "dual" | "quad") => void;
    connectRtsp: (url: string) => void;
  };
}

export interface DroneDashboardProps {
  initialTab?: TacticalNavTab;
}
