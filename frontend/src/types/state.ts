import type { TelemetryData, ViewportLayoutMode, SnapshotItem, SuspectSnapshot } from "./index";
import type { store } from "@/store";
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ConfigState {
  confidence_threshold: number;
  zone_polygon: [number, number][];
  isSaving: boolean;
}

export interface TelemetryState extends TelemetryData {
  isConnected: boolean;
  lastUpdated: number;
  active_camera_id: string;
  camera_name: string;
  camera_location: string;
  connected_camera_ids: string[];
  viewport_layout: ViewportLayoutMode;
  primary_camera_ids: Record<"ground" | "aerial", string>;
}

export interface UIState {
  isEditingZone: boolean;
  selectedSnapshot: SnapshotItem | null;
  activeSourceTab: "synthetic" | "webcam" | "file" | "rtsp";
  sirenMuted: boolean;
  suspectPortraits: SuspectSnapshot[];
}

export interface ParsedTimestamp {
  datePart: string;
  timePart: string;
}
