import { DroneAvionics } from "../index";
import type { DroneControlStatus, DroneDirection, DroneDirectionOption, DroneManualAction, DronePadLayout, DroneTelemetryTile, DroneVideoStatus } from "../droneControl";

export interface DronePadProps {
  pad: DronePadLayout;
  disabled: boolean;
  held: readonly DroneDirection[];
  onPress: (direction: DroneDirection) => void;
  onRelease: (direction: DroneDirection) => void;
}

export interface DroneStatusHeaderProps {
  status: DroneControlStatus | null;
  message: string;
}

export interface DroneTelemetryStripProps {
  tiles: readonly DroneTelemetryTile[];
}

export interface DroneFlightActionsProps {
  status: DroneControlStatus | null;
  pending: boolean;
  ownsControl: boolean;
  onConnect: (confirmedLanded?: boolean) => void;
  onAction: (action: DroneManualAction | "disconnect") => void;
}

export interface DroneCameraControlProps {
  video: DroneVideoStatus | null;
  videoError: string;
  videoPending: boolean;
  disabled: boolean;
  onStart: () => void;
}

export interface DroneEmergencyButtonProps {
  pending: boolean;
  onConfirm: () => void;
}

export interface DroneDirectionButtonProps {
  option: DroneDirectionOption;
  disabled: boolean;
  active: boolean;
  onPress: (direction: DroneDirection) => void;
  onRelease: (direction: DroneDirection) => void;
}

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

export interface DeviceDeckCardProps {
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  viewMode?: "aerial" | "ground";
  onToggleTuning?: () => void;
  isTuningOpen?: boolean;
}

export interface DeviceDeckHeaderProps {
  viewMode?: "aerial" | "ground";
}

export interface DeviceDeckActionsProps {
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  viewMode?: "aerial" | "ground";
}


