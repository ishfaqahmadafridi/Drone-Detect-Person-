"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { useVideoViewport } from "@/hooks";
import { ViewportHeader } from "./ViewportHeader";
import { ViewportScreen } from "./ViewportScreen";
import { StreamToolbar } from "./StreamToolbar";
import { VideoViewportProps } from "@/types";
import { VideoUploadControls } from "./VideoUploadControls";
import { SuspectSnapshots } from "./SuspectSnapshots";
import { ReIDPanel } from "../ReIDPanel";
import { VIDEO_TOOLS, VIEWPORT_CONTROLS } from "@/constants/tactical";

export const VideoViewport: React.FC<VideoViewportProps> = ({ onSnapshotTrigger, onManageCameras }) => {
  const {
    sourceType,
    fps,
    containerRef,
    streamKey,
    isConnectingRtsp,
    toggleFullscreen,
    isFullscreen,
    fullscreenSupported,
    handleSourceSelect,
    viewMode,
    streamError,
    handleStreamError,
    handleStreamLoad,
    error,
    replay,
    videoFinished,
    upload,
    portraits,
    viewportLayout,
    connectedCameraCount,
    handleLayoutChange,
  } = useVideoViewport();

  return (
    <div className={TACTICAL_VIEW_STYLES.VideoViewport_div_className}>
      <div ref={containerRef} className={VIEWPORT_CONTROLS.frameClass}>
        <ViewportHeader
          onManageCameras={onManageCameras}
          layoutMode={viewportLayout}
          onLayoutChange={handleLayoutChange}
          connectedCameraCount={connectedCameraCount}
          isFullscreen={isFullscreen}
          fullscreenSupported={fullscreenSupported}
          onSnapshotTrigger={onSnapshotTrigger}
          onToggleFullscreen={toggleFullscreen}
        />

        <ViewportScreen
          streamKey={streamKey}
          fps={fps}
          layoutMode={viewportLayout}
          streamError={streamError}
          onStreamLoad={handleStreamLoad}
          onStreamError={handleStreamError}
        />
      </div>

      <div className={VIDEO_TOOLS.sectionClass}>
        <StreamToolbar />
        <VideoUploadControls
          {...upload}
          isTesting={sourceType === "file"}
          finished={Boolean(videoFinished)}
          busy={isConnectingRtsp}
          onReplay={() => void replay()}
          onStopTest={() => handleSourceSelect("synthetic")}
        />
        {error && <p role="alert" className={`${VIDEO_TOOLS.errorClass} px-4 py-3`}>{error}</p>}
      </div>
      {viewMode === "aerial" && portraits.length > 0 && <div className={VIDEO_TOOLS.sectionClass}>
        <SuspectSnapshots portraits={portraits} />
        <div className="w-full px-4 pb-4"><ReIDPanel /></div>
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
export * from "./SuspectSelection";
export * from "./SuspectFreezeModal";
export * from "./SuspectSnapshots";
export * from "./SuspectPortraitGallery";
export * from "./SuspectPeopleList";
