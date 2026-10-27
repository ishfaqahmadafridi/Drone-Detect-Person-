"use client";
import { CAMERA_UI_TEXT } from "@/constants/tactical";

import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { StreamToolbarProps } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { setZoomLevel, toggleNightVision } from "@/store/slices/telemetrySlice";
import { StreamSourceSelector } from "./StreamSourceSelector";
import { StreamZoomControls } from "./StreamZoomControls";
import { StreamFilterControls } from "./StreamFilterControls";
import { StreamActionButtons } from "./StreamActionButtons";
import { StreamRtspForm } from "./StreamRtspForm";

export const StreamToolbar: React.FC<StreamToolbarProps> = ({
  sourceType,
  viewMode = "aerial",
  showRtspField,
  isConnectingRtsp,
  rtspInput,
  onSourceSelect,
  onRtspInputChange,
  onRtspSubmit,
  onSnapshotTrigger,
  onToggleFullscreen,
  onOpenEvidence,
}) => {
  const dispatch = useAppDispatch();
  const zoomLevel = useAppSelector((state) => state.telemetry.zoom_level ?? 1.0);
  const isNightVision = useAppSelector((state) => state.telemetry.is_night_vision ?? false);

  return (
    <div className={TACTICAL_VIEW_STYLES.StreamToolbar_div_className}>
      <div className="p-3 px-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left Toolbar Controls Cluster */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* 1. Stream Source Selector */}
          <StreamSourceSelector
            sourceType={sourceType}
            viewMode={viewMode}
            onSourceSelect={onSourceSelect}
          />

          {/* 2. Optical Zoom Presets (1x, 2x, 4x) */}
          <StreamZoomControls
            zoomLevel={zoomLevel}
            onZoomChange={(lvl) => dispatch(setZoomLevel(lvl))}
          />

          {/* 3. Night Vision / Infrared Filter Toggle */}
          <StreamFilterControls
            isNightVision={isNightVision}
            onToggleNightVision={() => dispatch(toggleNightVision())}
          />

          {/* 4. Action Controls: Forensic Snapshot & Evidence Captures */}
          <StreamActionButtons
            onSnapshotTrigger={onSnapshotTrigger}
            onOpenEvidence={onOpenEvidence}
          />
        </div>

        {/* Right Toolbar: Fullscreen Viewport Trigger */}
        <StreamActionButtons onToggleFullscreen={onToggleFullscreen} />
      </div>

      {/* Custom RTSP / Network Stream Field Drawer */}
      {showRtspField && (
        <div className={TACTICAL_VIEW_STYLES.StreamToolbar_div_className_2}>
          <StreamRtspForm
            show={showRtspField}
            isConnectingRtsp={isConnectingRtsp}
            rtspInput={rtspInput}
            onRtspInputChange={onRtspInputChange}
            onRtspSubmit={onRtspSubmit}
            placeholder={
              viewMode === "ground"
                ? CAMERA_UI_TEXT.StreamToolbar_7
                : "rtsp://drone-ip:8554/live"
            }
            buttonLabel={viewMode === "ground" ? "Connect Phone" : "Connect Drone"}
          />
        </div>
      )}
    </div>
  );
};

export default StreamToolbar;
export * from "./StreamSourceSelector";
export * from "./StreamZoomControls";
export * from "./StreamFilterControls";
export * from "./StreamActionButtons";
export * from "./StreamRtspForm";
