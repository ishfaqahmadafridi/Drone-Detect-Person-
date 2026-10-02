"use client";

import React, { useRef, useState } from "react";
import { TacticalCameraFeedPreviewProps } from "@/types";
import { getVideoStreamUrl } from "@/constants/network";
import { TACTICAL_FEED_PREVIEW_TOKENS } from "@/constants/tactical";
import { useProceduralFeedCanvas } from "@/hooks";
import { Radio, ShieldAlert } from "lucide-react";

export const TacticalCameraFeedPreview: React.FC<TacticalCameraFeedPreviewProps> = ({
  channel,
  isActive,
  className = "",
  onSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamError, setStreamError] = useState(false);

  // Dedicated custom hook manages requestAnimationFrame loop, tokens, and cleanup
  useProceduralFeedCanvas({
    canvasRef,
    viewMode: channel.viewMode,
    isActive,
    channelNum: channel.channelNum,
  });

  const tokens = TACTICAL_FEED_PREVIEW_TOKENS;
  const resolutionDisplay = channel.resolution || tokens.labels.defaultFpsResolution;

  return (
    <div
      onClick={onSelect}
      className={`relative aspect-video w-full rounded-lg overflow-hidden bg-black/95 border border-slate-800 flex items-center justify-center select-none group/preview ${className}`}
    >
      {isActive ? (
        <>
          {/* Active Live Video Stream from Backend */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getVideoStreamUrl()}
            alt={channel.name}
            onError={() => setStreamError(true)}
            className="w-full h-full object-cover pointer-events-none"
          />

          {streamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-amber-400 gap-2">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span className="font-mono-code text-[10px] tracking-wider uppercase">
                {tokens.labels.feedReestablishing}
              </span>
            </div>
          )}

          {/* Active Live HUD Overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/60 font-mono-code text-[10px] text-red-300 font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{tokens.labels.liveAiDetect}</span>
          </div>

          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-slate-700 font-mono-code text-[9px] text-slate-300">
            {channel.channelNum} • {resolutionDisplay}
          </div>
        </>
      ) : (
        <>
          {/* Procedural Real-Time Canvas Surveillance Preview */}
          <canvas
            ref={canvasRef}
            width={tokens.canvasWidth}
            height={tokens.canvasHeight}
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Standby / Online Feed Watermark Ribbon */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 font-mono-code text-[10px] text-slate-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="uppercase">
              {channel.status}: {tokens.labels.liveCoverageSuffix}
            </span>
          </div>

          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-slate-700 font-mono-code text-[9px] text-slate-300">
            {channel.channelNum}
          </div>

          {/* Hover Promotion Hint */}
          <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[1px]">
            <span className="px-3 py-1 rounded-md bg-blue-600/90 text-white font-display text-xs font-bold uppercase tracking-wider border border-blue-400 shadow-md">
              {tokens.labels.promoteHint}
            </span>
          </div>
        </>
      )}

      {/* Persistent Bottom Location Banner on Video */}
      <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded bg-black/80 border border-slate-800 font-mono-code text-[9px] text-slate-400 max-w-[70%] truncate">
        {channel.location}
      </div>
    </div>
  );
};

export default TacticalCameraFeedPreview;
