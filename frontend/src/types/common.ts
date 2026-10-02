// ==============================================================================
// Tactical Common & Detection Types
// ==============================================================================

export type ThreatLevel = "CLEAR" | "MONITORING" | "MULTI_PERSON" | "INTRUSION" | "MANUAL";
export type StreamSourceType = "synthetic" | "webcam" | "file" | "rtsp";
export type TacticalNavTab = "airspace" | "cameras" | "incidents" | "recordings" | "settings";
export type TrackingMode = "auto" | "manual";

export interface Detection {
  id: number;
  conf: number;
  bbox: [number, number, number, number];
  speed_px_s?: number;
  trajectory_len?: number;
  is_intruder: boolean;
  is_selected?: boolean;
}
