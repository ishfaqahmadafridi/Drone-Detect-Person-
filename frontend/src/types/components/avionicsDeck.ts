import { DroneAvionics } from "../index";

// ==========================================
// 8. Drone Flight & Avionics Component Props
// ==========================================
export interface DroneAvionicsCardProps {
  avionics?: DroneAvionics;
  onOpenFlightDeck?: () => void;
  onConnectAirLink?: () => void;
}

export interface AvionicsCardHeaderProps {
  flightState: string;
}

export interface BatteryHealthGaugeProps {
  battery: number;
  voltage: number;
  health: number;
  flightTime: number;
}

export interface FlightPhysicsGridProps {
  altitude: number;
  speed: number;
  sats: number;
}

export interface OpticalSensorStatusProps {
  camOnline: boolean;
  camDetecting: boolean;
}

export interface AvionicsActionButtonsProps {
  onOpenFlightDeck?: () => void;
  onConnectAirLink?: () => void;
}

export interface FlightControlDeckProps {
  flightState: string;
  altitude: number;
  batteryPercent: number;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
}

export interface FlightDeckHeaderProps {
  className?: string;
}

export interface FlightTelemetryBarProps {
  altitude: number;
  batteryPercent: number;
  flightState: string;
}

export interface FlightActionGridProps {
  flightState: string;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
}

export interface DeviceDeckCardProps {
  avionics?: DroneAvionics;
  flightState: string;
  altitude: number;
  batteryPercent: number;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  viewMode?: "aerial" | "ground";
  onToggleTuning?: () => void;
  isTuningOpen?: boolean;
}

export interface DeviceDeckHeaderProps {
  viewMode?: "aerial" | "ground";
}

export interface DeviceDeckGridProps {
  altitude: number;
  altitudeM?: number;
  groundSpeedMs?: number;
  compassHeadingDeg?: number;
  gpsSats?: number;
  batteryPercent?: number;
  latencyMs?: number;
  viewMode?: "aerial" | "ground";
}

export interface DeviceDeckActionsProps {
  flightState: string;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  viewMode?: "aerial" | "ground";
}


