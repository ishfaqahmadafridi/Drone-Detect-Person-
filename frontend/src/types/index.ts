export type ThreatLevel = "CLEAR" | "MONITORING" | "MULTI_PERSON" | "INTRUSION";
export type StreamSourceType = "synthetic" | "webcam" | "file" | "rtsp";
export type TacticalNavTab = "airspace" | "cameras" | "avionics" | "incidents" | "geofence" | "settings";

export interface Detection {
  id: number;
  conf: number;
  bbox: [number, number, number, number];
  speed_px_s?: number;
  trajectory_len?: number;
  is_intruder: boolean;
}

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

export interface TelemetryData {
  threat_level: ThreatLevel;
  alert_msg: string;
  total_persons: number;
  intruders_count: number;
  gathering_pairs: number;
  fps: number;
  frame_idx: number;
  timestamp: string;
  detections: Detection[];
  source_type: StreamSourceType;
  view_mode?: "aerial" | "ground";
  multi_person_threshold: number;
  confidence_threshold: number;
  proximity_distance_px: number;
  zone_polygon: [number, number][];
  avionics?: DroneAvionics;
}

export interface SurveillanceConfig {
  model_name: string;
  confidence_threshold: number;
  multi_person_threshold: number;
  proximity_alert_distance_px: number;
  zone_polygon: [number, number][];
  source_type: StreamSourceType;
}

export interface IncidentAlert {
  timestamp: string;
  threat_level: string;
  total_persons: string;
  intruders_count: string;
  gathering_clusters: string;
  person_ids: string;
  snapshot_path: string;
}

export interface SnapshotItem {
  filename: string;
  url: string;
  created_at: string;
  size_kb: number;
}

export interface ModelProfileInfo {
  name: string;
  filename: string;
  available: boolean;
  loaded: boolean;
  is_active: boolean;
  confidence: number;
  iou: number;
  description: string;
}

export interface ModelsStatusResponse {
  active_view: "aerial" | "ground";
  device: string;
  profiles: Record<string, ModelProfileInfo>;
}

export * from "./components";
