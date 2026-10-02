import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TelemetryData, ThreatLevel } from "@/types";
import { DEFAULT_AERIAL_MODEL_NAME, DEFAULT_AERIAL_ENGINE } from "@/constants/tactical";

interface TelemetryState extends TelemetryData {
  isConnected: boolean;
  lastUpdated: number;
  active_camera_id: string;
  camera_name: string;
  camera_location: string;
  viewport_layout: "single" | "dual" | "quad";
  connected_camera_ids: string[];
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
  active_camera_id: "CAM-01",
  camera_name: "UAV-01 Aerial Gimbal",
  camera_location: "North Airspace - Sector 04",
  viewport_layout: "dual",
  connected_camera_ids: ["CAM-01", "CAM-02"],
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
      action: PayloadAction<{ id: string; name: string; location: string }>
    ) => {
      state.active_camera_id = action.payload.id;
      state.camera_name = action.payload.name;
      state.camera_location = action.payload.location;
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
    setViewportLayout: (state, action: PayloadAction<"single" | "dual" | "quad">) => {
      state.viewport_layout = action.payload;
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
      if (state.connected_camera_ids.length === 1) {
        state.viewport_layout = "single";
      } else if (state.connected_camera_ids.length === 2) {
        state.viewport_layout = "dual";
      } else {
        state.viewport_layout = "quad";
      }
    },
    setConnectedCameras: (state, action: PayloadAction<string[]>) => {
      state.connected_camera_ids = action.payload;
      if (action.payload.length === 1) {
        state.viewport_layout = "single";
      } else if (action.payload.length === 2) {
        state.viewport_layout = "dual";
      } else {
        state.viewport_layout = "quad";
      }
    },
    connectAllCameras: (state) => {
      state.connected_camera_ids = ["CAM-01", "CAM-02", "CAM-03", "CAM-04", "CAM-05"];
      state.viewport_layout = "quad";
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
  setViewportLayout,
  toggleConnectCamera,
  setConnectedCameras,
  connectAllCameras,
  setNightVision,
  toggleNightVision,
} = telemetrySlice.actions;
export default telemetrySlice.reducer;
