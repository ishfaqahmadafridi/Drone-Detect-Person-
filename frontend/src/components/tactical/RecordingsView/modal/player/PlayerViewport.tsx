"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { PlayerViewportProps } from "@/types";

export const PlayerViewport: React.FC<PlayerViewportProps> = ({
  videoRef,
  url,
  isLooping,
  hasError = false,
  onPlay,
  onPause,
  onTimeUpdate,
  onLoadedMetadata,
  onError,
  onTogglePlay,
}) => {
  const [localError, setLocalError] = useState<boolean>(false);
  const isErr = hasError || localError;

  if (isErr) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-3 text-center my-auto min-h-[300px]">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-sm font-mono-code font-bold text-slate-200">
          Evidentiary Clip Empty or Corrupted
        </p>
        <p className="text-xs text-slate-400 max-w-md font-mono-code">
          This recording file was interrupted before data could be written (0 KB). Select a valid recording to play video footage.
        </p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={url}
      loop={isLooping}
      playsInline
      onPlay={onPlay}
      onPause={onPause}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onError={() => {
        setLocalError(true);
        onError?.();
      }}
      onClick={onTogglePlay}
      className="max-h-[68vh] w-auto max-w-full object-contain cursor-pointer"
    />
  );
};

export default PlayerViewport;
