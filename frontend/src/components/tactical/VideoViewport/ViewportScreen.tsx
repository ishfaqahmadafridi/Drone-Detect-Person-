"use client";

import React, { useState } from "react";
import { ViewportScreenProps } from "@/types";
import { ViewportStandbyLoader } from "./ViewportStandbyLoader";
import { ViewportStreamFeed } from "./ViewportStreamFeed";
import { ViewportCanvasLayer } from "./ViewportCanvasLayer";
import { ViewportHudOverlay } from "./ViewportHudOverlay";

export const ViewportScreen: React.FC<ViewportScreenProps> = ({
  containerRef,
  canvasRef,
  streamKey,
  fps,
  isEditingZone,
  onStreamError,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onSaveZone,
  onResetZone,
  onCancelZone,
}) => {
  const [streamLoaded, setStreamLoaded] = useState(false);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-[#02050e] overflow-hidden flex items-center justify-center border-y border-cyan-500/20"
    >
      {/* Tactical Standby / Reconnecting Screen */}
      <ViewportStandbyLoader isLoaded={streamLoaded} />

      {/* Live Video Feed Image */}
      <ViewportStreamFeed
        streamKey={streamKey}
        isLoaded={streamLoaded}
        onLoad={() => setStreamLoaded(true)}
        onError={() => {
          setStreamLoaded(false);
          onStreamError();
        }}
      />

      {/* Interactive Zone Canvas Overlay */}
      <ViewportCanvasLayer
        canvasRef={canvasRef}
        isEditingZone={isEditingZone}
        onCanvasMouseDown={onCanvasMouseDown}
        onCanvasMouseMove={onCanvasMouseMove}
        onCanvasMouseUp={onCanvasMouseUp}
      />

      {/* Tactical HUD Overlay (Reticles, Telemetry Badges, Zone Editing Banner) */}
      <ViewportHudOverlay
        fps={fps}
        isEditingZone={isEditingZone}
        onSaveZone={onSaveZone}
        onResetZone={onResetZone}
        onCancelZone={onCancelZone}
      />
    </div>
  );
};
