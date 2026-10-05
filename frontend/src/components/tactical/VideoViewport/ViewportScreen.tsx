"use client";

import React from "react";
import { ViewportScreenProps } from "@/types";
import { ViewportStandbyLoader } from "./ViewportStandbyLoader";
import { ViewportStreamFeed } from "./ViewportStreamFeed";
import { ViewportCanvasLayer } from "./ViewportCanvasLayer";
import { ViewportHudOverlay } from "./ViewportHudOverlay";
import { ViewportSplitGrid } from "./ViewportSplitGrid";
import { useViewportScreen } from "@/hooks";

export const ViewportScreen: React.FC<ViewportScreenProps> = ({
  containerRef,
  canvasRef,
  streamKey,
  fps,
  isEditingZone,
  streamError,
  layoutMode = "single",
  onStreamLoad,
  onStreamError,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
}) => {
  const { zoomLevel, isNightVision, activeCameraId, handleSelectCamera } =
    useViewportScreen();

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#02050e] flex items-center justify-center border-y border-slate-700/60 select-none ${layoutMode === "single" ? "aspect-video overflow-hidden" : "min-h-0"}`}
    >
      {layoutMode && layoutMode !== "single" ? (
        <ViewportSplitGrid
          layoutMode={layoutMode}
          activeCameraId={activeCameraId}
          fps={fps}
          onSelectCamera={handleSelectCamera}
        />
      ) : (
        <>
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

          {/* Optical Zoom & Night Vision HUD Badges */}
          {(zoomLevel > 1.0 || isNightVision) && (
            <div className="absolute bottom-4 left-10 z-20 pointer-events-none flex items-center gap-2">
              {zoomLevel > 1.0 && (
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-[10px] font-mono-code font-bold text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse">
                  OPTICAL ZOOM: {zoomLevel.toFixed(1)}x
                </span>
              )}
              {isNightVision && (
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-[10px] font-mono-code font-bold text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  IR NIGHT VISION (850nm)
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewportScreen;
