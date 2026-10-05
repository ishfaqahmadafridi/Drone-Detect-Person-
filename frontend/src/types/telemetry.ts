// ==============================================================================
// Live Telemetry & Surveillance Configuration Types
// ==============================================================================

import { ThreatLevel, StreamSourceType, TrackingMode, Detection } from "./common";
import { DroneAvionics } from "./avionics";

export interface TelemetryData {
  threat_level: ThreatLevel;
  alert_msg: string;
  total_persons: number;
  intruders_count: number;
  fps: number;
  frame_idx: number;
  timestamp: string;
  detections: Detection[];
  source_type: StreamSourceType;
  video_finished?: boolean;
  view_mode?: "aerial" | "ground";
  model_name?: string;
  engine?: string;
  confidence_threshold: number;
  zone_polygon: [number, number][];
  avionics?: DroneAvionics;
  tracking_mode?: TrackingMode;
  selected_target_ids?: number[];
  zoom_level?: number;
  is_night_vision?: boolean;
}

export interface SurveillanceConfig {
  model_name: string;
  confidence_threshold: number;
  zone_polygon: [number, number][];
  source_type: StreamSourceType;
}
