"use client";

import React from "react";
import { useVideoViewport } from "@/hooks";
import { ViewportHeader } from "./ViewportHeader";
import { ViewportScreen } from "./ViewportScreen";
import { StreamToolbar } from "./StreamToolbar";
import { VideoViewportProps } from "@/types";

export const VideoViewport: React.FC<VideoViewportProps> = ({ onSnapshotTrigger }) => {
  const {
    sourceType,
    fps,
    isEditingZone,
    containerRef,
    canvasRef,
    streamKey,
    rtspInput,
    setRtspInput,
    showRtspField,
    isConnectingRtsp,
    toggleFullscreen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleRtspSubmit,
    handleSourceSelect,
    handleViewSelect,
    viewMode,
    streamError,
    handleStreamError,
    handleStreamLoad,
    trackingMode,
    selectedCount,
    handleTrackingModeChange,
    handleClearSelectedTargets,
    handleSelectTargetAt,
  } = useVideoViewport();

  return (
    <div className="rounded-xl overflow-hidden flex flex-col border border-slate-700/60 bg-[#0F141F] shadow-lg">
      <ViewportScreen
        containerRef={containerRef}
        canvasRef={canvasRef}
        streamKey={streamKey}
        fps={fps}
        trackingMode={trackingMode}
        onSelectTargetAt={handleSelectTargetAt}
        isEditingZone={isEditingZone}
        streamError={streamError}
        onStreamLoad={handleStreamLoad}
        onStreamError={handleStreamError}
        onCanvasMouseDown={handleMouseDown}
        onCanvasMouseMove={handleMouseMove}
        onCanvasMouseUp={handleMouseUp}
      />

      <StreamToolbar
        sourceType={sourceType}
        viewMode={viewMode}
        showRtspField={showRtspField}
        isConnectingRtsp={isConnectingRtsp}
        rtspInput={rtspInput}
        onSourceSelect={handleSourceSelect}
        onViewSelect={handleViewSelect}
        onRtspInputChange={setRtspInput}
        onRtspSubmit={handleRtspSubmit}
        onSnapshotTrigger={onSnapshotTrigger}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
};

export default VideoViewport;
export * from "./ViewportHeader";
export * from "./ViewportScreen";
export * from "./ViewportStandbyLoader";
export * from "./ViewportStreamFeed";
export * from "./ViewportCanvasLayer";
export * from "./ViewportHudReticle";
export * from "./ViewportTelemetryBadges";
export * from "./ViewportHudOverlay";
export * from "./StreamToolbar";
export * from "./toolbar";
export * from "./ZoneBanner";
