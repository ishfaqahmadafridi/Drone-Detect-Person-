import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TelemetryData, ThreatLevel } from "@/types";

interface TelemetryState extends TelemetryData {
  isConnected: boolean;
  lastUpdated: number;
}

const initialState: TelemetryState = {
  threat_level: "CLEAR",
  alert_msg: "AIRSPACE SECURE - INITIALIZING",
  total_persons: 0,
  intruders_count: 0,
  gathering_pairs: 0,
  fps: 0,
  frame_idx: 0,
  timestamp: "",
  detections: [],
  source_type: "synthetic",
  view_mode: "aerial",
  model_name: "visdrone_person_best.pt",
  engine: "YOLO11n + BoT-SORT",
  multi_person_threshold: 2,
  confidence_threshold: 0.35,
  proximity_distance_px: 120,
  zone_polygon: [],
  isConnected: false,
  lastUpdated: 0,
  tracking_mode: "auto",
  selected_target_ids: [],
};

export const telemetrySlice = createSlice({
  name: "telemetry",
  initialState,
  reducers: {
    setTelemetryData: (state, action: PayloadAction<Partial<TelemetryData>>) => {
      Object.assign(state, action.payload);
      state.lastUpdated = Date.now();
    },
    setThreatLevel: (state, action: PayloadAction<ThreatLevel>) => {
      state.threat_level = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setTrackingMode: (state, action: PayloadAction<"auto" | "manual">) => {
      state.tracking_mode = action.payload;
      if (action.payload === "auto") {
        state.selected_target_ids = [];
      }
    },
    setSelectedTargetIds: (state, action: PayloadAction<number[]>) => {
      state.selected_target_ids = action.payload;
    },
  },
});

export const {
  setTelemetryData,
  setThreatLevel,
  setConnectionStatus,
  setTrackingMode,
  setSelectedTargetIds,
} = telemetrySlice.actions;
export default telemetrySlice.reducer;
