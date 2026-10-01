// ==============================================================================
// AI Vision Model Profiles & Network Probing Types
// ==============================================================================

import { StreamSourceType } from "./common";

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

export interface TestConnectionPayload {
  source_type: StreamSourceType;
  source_path?: string;
  host?: string;
  port?: number;
  stream_path?: string;
  username?: string;
  password?: string;
}

export interface TestConnectionResponse {
  success: boolean;
  latency_ms?: number;
  message: string;
  effective_url?: string;
}
