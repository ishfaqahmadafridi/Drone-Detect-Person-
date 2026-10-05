import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SnapshotItem, SuspectSnapshot } from "@/types";

interface UIState {
  isEditingZone: boolean;
  selectedSnapshot: SnapshotItem | null;
  activeSourceTab: "synthetic" | "webcam" | "file" | "rtsp";
  sirenMuted: boolean;
  suspectPortraits: SuspectSnapshot[];
}

const initialState: UIState = {
  isEditingZone: false,
  selectedSnapshot: null,
  activeSourceTab: "synthetic",
  sirenMuted: false,
  suspectPortraits: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSuspectPortraits: (state, action: PayloadAction<SuspectSnapshot[]>) => {
      state.suspectPortraits = action.payload;
    },
    setIsEditingZone: (state, action: PayloadAction<boolean>) => {
      state.isEditingZone = action.payload;
    },
    setSelectedSnapshot: (state, action: PayloadAction<SnapshotItem | null>) => {
      state.selectedSnapshot = action.payload;
    },
    setActiveSourceTab: (state, action: PayloadAction<"synthetic" | "webcam" | "file" | "rtsp">) => {
      state.activeSourceTab = action.payload;
    },
    setSirenMuted: (state, action: PayloadAction<boolean>) => {
      state.sirenMuted = action.payload;
    },
  },
});

export const { setIsEditingZone, setSelectedSnapshot, setActiveSourceTab, setSirenMuted, setSuspectPortraits } = uiSlice.actions;
export default uiSlice.reducer;
