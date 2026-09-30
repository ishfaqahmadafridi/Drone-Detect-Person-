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
  trackingMode = "auto",
  onSelectTargetAt,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
}) => {
  const [clickPing, setClickPing] = React.useState<{ x: number; y: number } | null>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trackingMode !== "manual" || !onSelectTargetAt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setClickPing({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setClickPing(null), 600);

    onSelectTargetAt(normX, normY);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative w-full aspect-video bg-[#02050e] overflow-hidden flex items-center justify-center border-y border-cyan-500/20 select-none ${
        trackingMode === "manual" ? "cursor-crosshair" : ""
      }`}
    >
      {/* Tactical Standby / Reconnecting Screen displayed only when connection drops */}
      {streamError && <ViewportStandbyLoader isLoaded={false} />}

      {/* Manual Mode Operator Advisory Banner */}
      {trackingMode === "manual" && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 bg-amber-950/80 border border-amber-500/50 rounded-full flex items-center gap-2 backdrop-blur-sm shadow-lg shadow-amber-950/40">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-mono-code font-bold text-amber-300 tracking-wider uppercase">
            MANUAL MODE: CLICK PERSON TO LOCK TARGET
          </span>
        </div>
      )}

      {/* Click Ping Animation for Manual Targeting */}
      {clickPing && (
        <div
          className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
          style={{ left: clickPing.x, top: clickPing.y }}
        >
          <span className="block w-10 h-10 rounded-full border-2 border-amber-400 animate-ping" />
          <span className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-amber-400/90 shadow-sm" />
        </div>
      )}

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
