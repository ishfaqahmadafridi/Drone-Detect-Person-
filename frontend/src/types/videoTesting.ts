import type { Detection } from "./common";

export interface SuspectSnapshot {
  id: number;
  image: string;
  capturedAt: string;
}

export interface SuspectSnapshotsProps {
  portraits: SuspectSnapshot[];
  reference?: boolean;
}

export interface FrozenSelection {
  token: string;
  image: string;
  width: number;
  height: number;
  detections: Detection[];
  selected_ids: number[];
  source_type: string;
  expires_in: number;
}


export interface TrackingModeResponse {
  status: string;
  mode: "auto" | "manual";
  selected_ids: number[];
}

export interface TargetSelectResponse {
  status: string;
  mode: string;
  selected_ids: number[];
  toggled_id?: number;
}


export type StreamChannel = "ground" | "aerial";
export interface ChannelPanelProps { channel: StreamChannel; }
export interface SuspectSelectionProps {
  channel?: StreamChannel;
  sourceType?: string;
  selectedTargetIds?: number[];
}
