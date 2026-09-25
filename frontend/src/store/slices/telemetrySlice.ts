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
  multi_person_threshold: 2,
  confidence_threshold: 0.35,
  proximity_distance_px: 120,
  zone_polygon: [
    [0.25, 0.25],
    [0.75, 0.25],
    [0.75, 0.75],
    [0.25, 0.75],
  ],
  isConnected: false,
  lastUpdated: 0,
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
  },
});

export const { setTelemetryData, setThreatLevel, setConnectionStatus } = telemetrySlice.actions;
export default telemetrySlice.reducer;
