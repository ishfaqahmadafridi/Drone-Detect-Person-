"use client";

import React from "react";
import { useVideoViewport } from "@/hooks";
import { ViewportHeader } from "./ViewportHeader";
import { ViewportScreen } from "./ViewportScreen";
import { StreamToolbar } from "./StreamToolbar";
import { VideoViewportProps } from "@/types";
import { VideoUploadControls } from "./VideoUploadControls";
import { SuspectSelection } from "./SuspectSelection";
import { SuspectSnapshots } from "./SuspectSnapshots";
import { GroundCameraConnections } from "./GroundCameraConnections";
import { ReIDPanel } from "../ReIDPanel";
import { VIDEO_TESTING } from "@/constants/tactical";

export const VideoViewport: React.FC<VideoViewportProps> = ({ onSnapshotTrigger, onManageCameras }) => {
  const {
    sourceType,
    fps,
    containerRef,
    streamKey,
    rtspInput,
    setRtspInput,
    showRtspField,
    isConnectingRtsp,
    toggleFullscreen,
    handleRtspSubmit,
    handleSourceSelect,
    handleViewSelect,
    viewMode,
    streamError,
    handleStreamError,
    handleStreamLoad,
    selectedTargetIds,
    error,
    replay,
    videoFinished,
    upload,
    portraits,
    viewportLayout,
    handleLayoutChange,
  } = useVideoViewport();

  return (
    <div className="rounded-xl overflow-hidden flex flex-col border border-slate-700/60 bg-[#0F141F] shadow-lg">
      <ViewportHeader
        sourceType={sourceType}
        viewMode={viewMode}
        layoutMode={viewportLayout}
        onLayoutChange={handleLayoutChange}
        onSnapshotTrigger={onSnapshotTrigger}
        onToggleFullscreen={toggleFullscreen}
      />

      <ViewportScreen
        containerRef={containerRef}
        streamKey={streamKey}
        fps={fps}
        layoutMode={viewportLayout}
        streamError={streamError}
        onStreamLoad={handleStreamLoad}
        onStreamError={handleStreamError}
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
      <VideoUploadControls {...upload} />
      {error && <p role="alert" className={VIDEO_TESTING.panelClass}>{error}</p>}
      {sourceType === "file" && <div className={VIDEO_TESTING.panelClass}>
        {videoFinished && <span>Video ended</span>}
        <button className={VIDEO_TESTING.buttonClass} onClick={() => void replay()} disabled={isConnectingRtsp}>Replay video</button>
      </div>}
      <SuspectSelection key={viewMode} channel={viewMode} sourceType={sourceType} selectedTargetIds={selectedTargetIds} />
      {viewMode === "ground" && portraits.length > 0 && <div className={VIDEO_TESTING.panelClass}>
        <button className={VIDEO_TESTING.buttonClass} onClick={() => void handleViewSelect("aerial")}>Open Aerial View & match</button>
      </div>}
      {viewMode === "ground" && <GroundCameraConnections onManageCameras={onManageCameras} />}
      {viewMode === "aerial" && <div className={VIDEO_TESTING.panelClass}>
        <SuspectSnapshots portraits={portraits} reference />
        {portraits.length > 0 && <div className="w-full"><ReIDPanel /></div>}
      </div>}
    </div>
  );
};

export default VideoViewport;
export * from "./ViewportHeader";
export * from "./ViewportScreen";
export * from "./ViewportSplitGrid";
export * from "./ViewportStandbyLoader";
export * from "./ViewportStreamFeed";
export * from "./ViewportCanvasLayer";
export * from "./ViewportHudReticle";
export * from "./ViewportTelemetryBadges";
export * from "./ViewportHudOverlay";
export * from "./StreamToolbar";
export * from "./toolbar";
export * from "./ZoneBanner";
