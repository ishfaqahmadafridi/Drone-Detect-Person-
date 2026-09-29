"use client";

import React from "react";
import { Volume2, VolumeX, Repeat, Maximize2 } from "lucide-react";
import { PlayerActionControlsProps } from "@/types";

export const PlayerActionControls: React.FC<PlayerActionControlsProps> = ({
  playbackRate,
  isLooping,
  isMuted,
  onCycleSpeed,
  onToggleLoop,
  onToggleMute,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Speed Multiplier */}
      <button
        onClick={onCycleSpeed}
        className="px-2.5 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 text-[10px] font-mono-code font-bold tracking-wider transition-all"
        title="Playback Speed"
      >
        {playbackRate}x SPEED
      </button>

      {/* Loop Toggle */}
      <button
        onClick={onToggleLoop}
        className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
          isLooping
            ? "bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
        }`}
        title={isLooping ? "Loop Enabled" : "Loop Disabled"}
      >
        <Repeat className="w-3.5 h-3.5" />
      </button>

      {/* Audio Mute */}
      <button
        onClick={onToggleMute}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition-all"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Fullscreen */}
      <button
        onClick={onToggleFullscreen}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-cyan-300 transition-all"
        title="Fullscreen"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default PlayerActionControls;
