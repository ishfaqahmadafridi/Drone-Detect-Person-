import type { TacticalCameraChannel, SnapshotItem } from "./index";
import type { StreamChannel, StreamSourceType } from "./index";

export interface SourceSelectionInput {
  sourceType: StreamSourceType;
  sourcePath?: string;
  channel?: StreamChannel;
}

export interface ActiveCameraInfo {
  camId: string;
  camName: string;
  camLoc: string;
  isGround: boolean;
  isSimulation: boolean;
  sensorTag: string;
}

export interface CameraListResponse {
  cameras: TacticalCameraChannel[];
  active_camera_id: string;
}

export interface CameraSwitchResponse {
  success: boolean;
  message: string;
  active_camera: TacticalCameraChannel;
}

export interface CameraCreatePayload {
  name: string;
  location: string;
  device_type?: string;
  view_mode?: string;
  source_type?: string;
  stream_url?: string;
  ip_address?: string;
  resolution?: string;
}

export interface UpdateConfigPayload {
  confidence_threshold?: number;
  zone_polygon?: [number, number][];
}

export interface RecordingStatusResponse {
  is_recording: boolean;
}

export interface StartRecordingResponse {
  message: string;
  filename: string;
  view_mode: string;
  is_recording: boolean;
}

export interface StopRecordingResponse {
  message: string;
  record: SnapshotItem;
}

export interface EvidenceListResponse {
  total: number;
  count: number;
  records: SnapshotItem[];
}
