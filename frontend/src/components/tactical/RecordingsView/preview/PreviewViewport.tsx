"use client";

import React from "react";
import { Film, Maximize2 } from "lucide-react";
import { PreviewViewportProps } from "@/types";
import { getPerspectiveLabel } from "@/utils";

export const PreviewViewport: React.FC<PreviewViewportProps> = ({
  selectedSnapshot,
  onOpenModal,
}) => {
  const perspectiveLabel = getPerspectiveLabel(selectedSnapshot.view_mode);

    const isVideo = selectedSnapshot.media_type === "video" || selectedSnapshot.filename.endsWith(".mp4");

    return (
      <div
        onClick={onOpenModal}
        className="relative flex-1 bg-black flex items-center justify-center overflow-hidden cursor-pointer group"
      >
        {selectedSnapshot.url ? (
          isVideo ? (
            <video
              src={selectedSnapshot.url}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <img
              src={selectedSnapshot.url}
              alt={selectedSnapshot.filename}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            />
          )
        ) : (
          <div className="text-slate-600 text-xs font-mono-code flex flex-col items-center gap-2">
            <Film className="w-10 h-10 text-slate-700" />
            <span>IMAGE / VIDEO FEED UNAVAILABLE</span>
          </div>
        )}

      {/* Corner HUD Reticles */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none" />

      {/* Tactical Watermark / OSD */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-slate-800 text-[10px] font-mono-code text-slate-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span>EVIDENCE CAPTURE · {perspectiveLabel}</span>
      </div>

      {/* Click-to-expand overlay hint */}
      <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/50 text-cyan-300 font-mono-code text-xs font-bold shadow-xl backdrop-blur-md">
          <Maximize2 className="w-4 h-4" />
          <span>CLICK TO EXPAND INSPECTOR</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewViewport;
