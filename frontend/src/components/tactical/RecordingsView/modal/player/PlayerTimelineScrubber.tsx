"use client";

import React from "react";
import { PlayerTimelineScrubberProps } from "@/types";

export const PlayerTimelineScrubber: React.FC<PlayerTimelineScrubberProps> = ({
  currentTime,
  duration,
  progressPercent,
  onSeek,
  formattedCurrent,
  formattedDuration,
}) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <span className="font-mono-code text-[11px] text-cyan-400 font-bold w-12 text-right shrink-0">
        {formattedCurrent}
      </span>

      <div className="relative flex-1 flex items-center h-4 group/scrub cursor-pointer">
        <div className="absolute inset-0 top-1.5 h-1.5 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={onSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title="Scrub video timeline"
        />
      </div>

      <span className="font-mono-code text-[11px] text-slate-500 font-bold w-12 shrink-0">
        {formattedDuration}
      </span>
    </div>
  );
};

export default PlayerTimelineScrubber;
