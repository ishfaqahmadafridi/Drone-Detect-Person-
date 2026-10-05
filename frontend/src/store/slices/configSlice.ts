import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigState {
  confidence_threshold: number;
  zone_polygon: [number, number][];
  isSaving: boolean;
}

const initialState: ConfigState = {
  confidence_threshold: 0.35,
  zone_polygon: [
    [0.25, 0.25],
    [0.75, 0.25],
    [0.75, 0.75],
    [0.25, 0.75],
  ],
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
