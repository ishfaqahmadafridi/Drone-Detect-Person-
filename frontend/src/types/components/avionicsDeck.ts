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
export interface DeviceDeckCardProps {
  viewMode?: "aerial" | "ground";
  onToggleTuning?: () => void;
  isTuningOpen?: boolean;
}


