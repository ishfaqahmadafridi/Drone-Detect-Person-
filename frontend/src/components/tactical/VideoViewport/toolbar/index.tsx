"use client";

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
    <div className="flex flex-col border-t border-slate-800 bg-[#0B0E14] select-none">
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
        <div className="p-3 px-4 border-t border-slate-800/80 bg-slate-950/40">
          <StreamRtspForm
            show={showRtspField}
            isConnectingRtsp={isConnectingRtsp}
            rtspInput={rtspInput}
            onRtspInputChange={onRtspInputChange}
            onRtspSubmit={onRtspSubmit}
            placeholder={
              viewMode === "ground"
                ? "http://10.10.20.117:8080 (Phone IP)"
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
