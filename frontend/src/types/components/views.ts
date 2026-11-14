import type { ViewportAction } from "./viewport";
import { TacticalNavTab } from "../index";
import type { TacticalCameraChannel } from "./cameraWall";

// ==========================================
// 11. Tactical Views & Viewport Router Props
// ==========================================
export interface AirspaceCommandViewProps {
  onSnapshotTrigger: ViewportAction;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
  onTabChange?: (tab: TacticalNavTab) => void;
}

export interface IncidentAuditViewProps {
  className?: string;
}

export interface TacticalViewRouterProps {
  activeTab: TacticalNavTab;
  onSnapshotTrigger: ViewportAction;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
  onTabChange?: (tab: TacticalNavTab) => void;
}

export interface MissionCommandViewportProps {
  activeTab: TacticalNavTab;
  onSnapshotTrigger: ViewportAction;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
  onTabChange?: (tab: TacticalNavTab) => void;
}


export interface ConnectionsViewProps {
  onTabChange?: (tab: TacticalNavTab) => void;
}

export interface DroneConnectionCardProps {
  onOpenFlightControls: () => void;
}

export interface CameraConnectionRowProps {
  camera: TacticalCameraChannel;
  isConnected: boolean;
  isMain: boolean;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export interface ConnectionDetail {
  label: string;
  value: string;
}

export interface DetectionChannelRowProps {
  channel: "aerial" | "ground";
  label: string;
}
