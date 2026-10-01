import { DroneAvionics, TacticalNavTab } from "../index";

// ==========================================
// 11. Tactical Views & Viewport Router Props
// ==========================================
export interface AirspaceCommandViewProps {
  onSnapshotTrigger: () => void;
  flightState: string;
  altitude: number;
  batteryPercent: number;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  onConnectAirLink?: () => void;
  onOpenFlightDeck: () => void;
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
}

export interface IncidentAuditViewProps {
  className?: string;
}

export interface CalibrationViewProps {
  avionics?: DroneAvionics;
  onOpenFlightDeck: () => void;
  onConnectAirLink?: () => void;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
}

export interface TacticalViewRouterProps {
  activeTab: TacticalNavTab;
  onSnapshotTrigger: () => void;
  flightState: string;
  altitude: number;
  batteryPercent: number;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  onConnectAirLink?: () => void;
  onOpenFlightDeck: () => void;
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
}

export interface MissionCommandViewportProps {
  activeTab: TacticalNavTab;
  avionics?: DroneAvionics;
  flightState: string;
  altitude: number;
  batteryPercent: number;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  onConnectAirLink?: () => void;
  onOpenFlightDeck: () => void;
  onRefresh: () => void;
  onSnapshotTrigger?: () => void;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
}
