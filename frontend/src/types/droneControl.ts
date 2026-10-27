export type DroneDirection = "left" | "right" | "forward" | "backward" | "up" | "down" | "rotateLeft" | "rotateRight";
export type DroneManualAction = "takeoff" | "land" | "hover";

export interface DroneControlAxes {
  left_right: number;
  forward_back: number;
  up_down: number;
  yaw: number;
}

export interface DroneControlStatus {
  mode: "simulation" | "tello";
  connected: boolean;
  flight_state: "landed" | "airborne" | "unknown";
  axes: DroneControlAxes;
  input_expired: boolean;
  error: string;
}

export interface DroneDirectionOption {
  direction: DroneDirection;
  label: string;
  axis: keyof DroneControlAxes;
  sign: number;
}
