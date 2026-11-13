import type { LucideIcon } from "lucide-react";

export type DroneDirection = "left" | "right" | "forward" | "backward" | "up" | "down" | "rotateLeft" | "rotateRight";
export type DroneManualAction = "takeoff" | "land" | "hover";

export interface DroneControlAxes {
  left_right: number;
  forward_back: number;
  up_down: number;
  yaw: number;
}

/** Latest Tello state broadcast; fields are null when the firmware omits them. */
export interface DroneTelemetry {
  battery_percent: number | null;
  height_cm: number | null;
  temperature_high_c: number | null;
  age_s: number;
  fresh: boolean;
}

export interface DroneControlStatus {
  mode: "simulation" | "tello";
  connected: boolean;
  flight_state: "landed" | "airborne" | "unknown";
  axes: DroneControlAxes;
  input_expired: boolean;
  error: string;
  telemetry?: DroneTelemetry | null;
}

export interface DroneDirectionOption {
  direction: DroneDirection;
  label: string;
  axis: keyof DroneControlAxes;
  sign: number;
  /** KeyboardEvent.code that holds this direction. */
  key: string;
  keyLabel: string;
  icon: LucideIcon;
}

export interface DronePadLayout {
  label: string;
  /** Row-major 3x3 grid; null cells are empty. */
  cells: readonly (DroneDirection | null)[];
}

export interface DroneTelemetryTile {
  label: string;
  value: string;
  warn: boolean;
}

export interface GroundSensorSpec {
  label: string;
  value: string;
}

export interface DroneVideoStatus {
  requested: boolean;
  receiving: boolean;
  message: string;
}
