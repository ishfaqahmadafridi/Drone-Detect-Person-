import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TelemetryData, ThreatLevel } from "@/types";
import { DEFAULT_AERIAL_MODEL_NAME, DEFAULT_AERIAL_ENGINE } from "@/constants/tactical";

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
  model_name: DEFAULT_AERIAL_MODEL_NAME,
  engine: DEFAULT_AERIAL_ENGINE,
  multi_person_threshold: 2,
  confidence_threshold: 0.35,
  proximity_distance_px: 120,
  zone_polygon: [],
  isConnected: false,
  lastUpdated: 0,
  tracking_mode: "auto",
  selected_target_ids: [],
  zoom_level: 1.0,
  is_night_vision: false,
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
    setZoomLevel: (state, action: PayloadAction<number>) => {
      state.zoom_level = action.payload;
    },
    setNightVision: (state, action: PayloadAction<boolean>) => {
      state.is_night_vision = action.payload;
    },
    toggleNightVision: (state) => {
      state.is_night_vision = !state.is_night_vision;
    },
  },
});

export const {
  setTelemetryData,
  setThreatLevel,
  setConnectionStatus,
  setTrackingMode,
  setSelectedTargetIds,
  setZoomLevel,
  setNightVision,
  toggleNightVision,
} = telemetrySlice.actions;
export default telemetrySlice.reducer;
