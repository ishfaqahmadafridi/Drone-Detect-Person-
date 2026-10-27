import { DEFAULT_RESTRICTED_ZONE, DEFAULT_DETECTION_CONFIDENCE } from "@/constants/tactical";
import type { ConfigState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState: ConfigState = {
  confidence_threshold: DEFAULT_DETECTION_CONFIDENCE,
  zone_polygon: [...DEFAULT_RESTRICTED_ZONE],
  isSaving: false,
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    updateConfigState: (state, action: PayloadAction<Partial<ConfigState>>) => {
      Object.assign(state, action.payload);
    },
    setZonePolygon: (state, action: PayloadAction<[number, number][]>) => {
      state.zone_polygon = action.payload;
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
  },
});

export const { updateConfigState, setZonePolygon, setIsSaving } = configSlice.actions;
export default configSlice.reducer;
