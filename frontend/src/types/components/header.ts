import { ThreatLevel, DroneAvionics } from "../index";

// ==========================================
// 1. Header Component Props
// ==========================================
export interface HeaderProps {
  onRefresh: () => void;
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
}

export interface BrandClusterProps {
  isConnected: boolean;
}

export interface ThreatRibbonProps {
  threatLevel: ThreatLevel;
  alertMsg: string;
}

export interface HeaderActionsProps {
  onRefresh: () => void;
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
}

export interface AvionicsQuickPillsProps {
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
}

export interface FlightStatePillProps {
  flightState: string;
  isAirborne: boolean;
  altitude: number;
  heading: number;
}

export interface DroneBatteryPillProps {
  batteryPct: number;
  isBatteryLow: boolean;
  health: number;
  voltage: number;
}

export interface GroundSensorPillProps {
  sensorId?: string;
  name?: string;
  mountHeight?: string;
}

export interface GroundPowerPillProps {
  powerSource?: string;
  powerStatus?: string;
}

export interface AerialAvionicsPillsProps {
  avionics?: DroneAvionics;
}

export interface GroundPerimeterPillsProps {
  className?: string;
}

export interface HeaderClockProps {
  utcTime?: string;
}

export interface CameraWallTriggerProps {
  onOpenWall: () => void;
}

export interface AudioAlertToggleProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export interface HeaderRefreshButtonProps {
  onRefresh: () => void;
}
