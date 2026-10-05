import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TelemetryData, ThreatLevel, ViewportLayoutMode } from "@/types";
import { DEFAULT_AERIAL_MODEL_NAME, DEFAULT_AERIAL_ENGINE } from "@/constants/tactical";

interface TelemetryState extends TelemetryData {
  isConnected: boolean;
  lastUpdated: number;
  active_camera_id: string;
  camera_name: string;
  camera_location: string;
  connected_camera_ids: string[];
  viewport_layout: ViewportLayoutMode;
  primary_camera_ids: Record<"ground" | "aerial", string>;
}

const initialState: TelemetryState = {
  threat_level: "CLEAR",
  alert_msg: "AIRSPACE SECURE - INITIALIZING",
  total_persons: 0,
  intruders_count: 0,
  fps: 0,
  frame_idx: 0,
  timestamp: "",
  detections: [],
  source_type: "synthetic",
  view_mode: "aerial",
  model_name: DEFAULT_AERIAL_MODEL_NAME,
  engine: DEFAULT_AERIAL_ENGINE,
  confidence_threshold: 0.35,
  zone_polygon: [],
  isConnected: false,
  lastUpdated: 0,
  tracking_mode: "auto",
  selected_target_ids: [],
  zoom_level: 1.0,
  is_night_vision: false,
  active_camera_id: "CAM-01",
  camera_name: "UAV-01 Aerial Gimbal",
  camera_location: "North Airspace - Sector 04",
  connected_camera_ids: ["CAM-01"],
  viewport_layout: "single",
  primary_camera_ids: { ground: "CAM-02", aerial: "CAM-01" },
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
    setActiveCamera: (
      state,
      action: PayloadAction<{ id: string; name: string; location: string; viewMode?: "ground" | "aerial" }>
    ) => {
      state.active_camera_id = action.payload.id;
      state.camera_name = action.payload.name;
      state.camera_location = action.payload.location;
      if (action.payload.viewMode) state.primary_camera_ids[action.payload.viewMode] = action.payload.id;
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
    toggleConnectCamera: (state, action: PayloadAction<string>) => {
      const camId = action.payload;
      if (state.connected_camera_ids.includes(camId)) {
        if (state.connected_camera_ids.length > 1) {
          state.connected_camera_ids = state.connected_camera_ids.filter((id) => id !== camId);
          if (state.active_camera_id === camId) {
            state.active_camera_id = state.connected_camera_ids[0];
          }
        }
      } else {
        state.connected_camera_ids.push(camId);
      }
    },
    setConnectedCameras: (state, action: PayloadAction<string[]>) => {
      state.connected_camera_ids = action.payload;
    },
    setViewportLayout: (state, action: PayloadAction<ViewportLayoutMode>) => {
      state.viewport_layout = action.payload;
    },
    connectAllCameras: (state) => {
      state.connected_camera_ids = ["CAM-01", "CAM-02", "CAM-03", "CAM-04", "CAM-05"];
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
  setActiveCamera,
  setTrackingMode,
  setSelectedTargetIds,
  setZoomLevel,
  toggleConnectCamera,
  setConnectedCameras,
  setViewportLayout,
  connectAllCameras,
  setNightVision,
  toggleNightVision,
} = telemetrySlice.actions;
export default telemetrySlice.reducer;
