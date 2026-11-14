"use client";

import React from "react";
import { VIDEO_TOOLS } from "@/constants/tactical";
import { useAppDispatch, useAppSelector } from "@/store";
import { setZoomLevel, toggleNightVision } from "@/store/slices/telemetrySlice";
import { StreamZoomControls } from "./StreamZoomControls";
import { StreamFilterControls } from "./StreamFilterControls";

/** View options for the main video. The source follows the perspective and the drone panel. */
export const StreamToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const zoomLevel = useAppSelector((state) => state.telemetry.zoom_level ?? 1);
  const isNightVision = useAppSelector((state) => state.telemetry.is_night_vision ?? false);

  return (
    <div role="group" aria-label="Video view options" className={VIDEO_TOOLS.viewRowClass}>
      <StreamZoomControls zoomLevel={zoomLevel} onZoomChange={(level) => dispatch(setZoomLevel(level))} />
      <StreamFilterControls isNightVision={isNightVision} onToggleNightVision={() => dispatch(toggleNightVision())} />
    </div>
  );
};

export default StreamToolbar;
