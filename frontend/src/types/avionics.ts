// ==============================================================================
// UAV Flight State & Drone Avionics Types
// ==============================================================================

export type DroneFlightState =
  | "DISARMED"
  | "STANDBY"
  | "ARMED"
  | "TAKEOFF"
  | "AIRBORNE"
  | "PATROL"
  | "HOVER"
  | "RTL"
  | "LANDED";

export interface DroneAvionics {
  flight_state: DroneFlightState | string;
  battery_percent: number;
  battery_voltage: number;
  battery_health_percent: number;
  battery_temp_c: number;
  flight_time_remaining_min: number;
  altitude_m: number;
  ground_speed_ms: number;
  gps_sats: number;
  gps_fix: string;
  compass_heading_deg: number;
  link_quality_percent: number;
  camera_online: boolean;
  camera_resolution: string;
  camera_fps: number;
  camera_sensor_temp_c: number;
  camera_detecting: boolean;
}

export interface DroneCommandResponse {
  success: boolean;
  message: string;
  flight_state: string;
  altitude_m: number;
  battery_percent: number;
}
