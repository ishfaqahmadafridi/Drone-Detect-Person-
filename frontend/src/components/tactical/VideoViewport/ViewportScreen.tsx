"use client";

import React from "react";
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
  streamError,
  onStreamLoad,
  onStreamError,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onSaveZone,
  onResetZone,
  onClearZone,
  onCancelZone,
}) => {
  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-[#02050e] overflow-hidden flex items-center justify-center border-y border-cyan-500/20"
    >
      {/* Tactical Standby / Reconnecting Screen displayed only when connection drops */}
      {streamError && <ViewportStandbyLoader isLoaded={false} />}

      {/* Live Video Feed Image */}
      <ViewportStreamFeed
        streamKey={streamKey}
        isLoaded={!streamError}
        onLoad={onStreamLoad}
        onError={onStreamError}
      />

      {/* Interactive Zone Canvas Overlay */}
      {isEditingZone && canvasRef && onCanvasMouseDown && onCanvasMouseMove && onCanvasMouseUp && (
        <ViewportCanvasLayer
          canvasRef={canvasRef}
          isEditingZone={isEditingZone}
          onCanvasMouseDown={onCanvasMouseDown}
          onCanvasMouseMove={onCanvasMouseMove}
          onCanvasMouseUp={onCanvasMouseUp}
        />
      )}

      {/* Tactical HUD Overlay (Reticles, Telemetry Badges) */}
      <ViewportHudOverlay fps={fps} />
    </div>
  );
};
