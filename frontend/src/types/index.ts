export type ThreatLevel = "CLEAR" | "MONITORING" | "MULTI_PERSON" | "INTRUSION";
export type StreamSourceType = "synthetic" | "webcam" | "file" | "rtsp";

export interface Detection {
  id: number;
  conf: number;
  bbox: [number, number, number, number];
  is_intruder: boolean;
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
  multi_person_threshold: number;
  confidence_threshold: number;
  proximity_distance_px: number;
  zone_polygon: [number, number][];
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

export * from "./components";
