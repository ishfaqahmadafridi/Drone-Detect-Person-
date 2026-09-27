"use client";

import React from "react";
import { ViewportScreenProps } from "@/types";
import { ZoneBanner } from "./ZoneBanner";

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
  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Live Video Feed Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={streamKey}
        src={`/api/stream/video_feed?t=${streamKey}`}
        alt="Aerial Drone Video Stream"
        onError={onStreamError}
        className="w-full h-full object-contain pointer-events-none"
      />

      {/* Interactive Zone Canvas Overlay */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
        className={`absolute inset-0 w-full h-full z-10 ${
          isEditingZone ? "cursor-crosshair" : "pointer-events-none"
        }`}
      />

      {/* Tactical HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-dashed border-cyan-400/30" />

        <div className="absolute top-4 left-10 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded font-mono-code text-[10px] text-slate-300 flex gap-3">
          <span>
            LATENCY: <strong className="text-cyan-400">18ms</strong>
          </span>
          <span>
            INFERENCE: <strong className="text-cyan-400">{fps ? fps.toFixed(1) : "0.0"} FPS</strong>
          </span>
        </div>

        <div className="absolute top-4 right-10 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded font-mono-code text-[10px] text-slate-300 flex gap-3">
          <span>RES: <strong className="text-cyan-400">1280x720</strong></span>
          <span>ENGINE: <strong className="text-cyan-400">YOLOv8 + ByteTrack</strong></span>
        </div>

        {isEditingZone && (
          <ZoneBanner
            onSave={onSaveZone}
            onReset={onResetZone}
            onCancel={onCancelZone}
          />
        )}
      </div>
    </div>
  );
};
