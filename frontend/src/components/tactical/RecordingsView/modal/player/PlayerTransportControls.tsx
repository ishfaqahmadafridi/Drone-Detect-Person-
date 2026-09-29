"use client";

import React from "react";
import { Play, Pause, Square, RotateCcw, RotateCw } from "lucide-react";
import { PlayerTransportControlsProps } from "@/types";

export const PlayerTransportControls: React.FC<PlayerTransportControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onStop,
  onSkip,
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Play / Pause Toggle */}
      <button
        onClick={onTogglePlay}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        title={isPlaying ? "Pause (Space)" : "Play (Space)"}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* Stop & Reset */}
      <button
        onClick={onStop}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-400 hover:text-rose-300 transition-all"
        title="Stop & Return to Start"
      >
        <Square className="w-3.5 h-3.5 fill-current" />
      </button>

      {/* Step Back -5s */}
      <button
        onClick={() => onSkip(-5)}
        className="flex items-center gap-1 px-2.5 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-300 text-[10px] font-mono-code font-bold transition-all"
        title="Rewind 5 seconds (Left Arrow)"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>-5s</span>
      </button>

      {/* Step Forward +5s */}
      <button
        onClick={() => onSkip(5)}
        className="flex items-center gap-1 px-2.5 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-300 text-[10px] font-mono-code font-bold transition-all"
        title="Forward 5 seconds (Right Arrow)"
      >
        <span>+5s</span>
        <RotateCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default PlayerTransportControls;
