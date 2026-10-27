"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
      <span className={TACTICAL_VIEW_STYLES.PlayerTimelineScrubber_span_className}>
        {formattedCurrent}
      </span>

      <div className="relative flex-1 flex items-center h-4 group/scrub cursor-pointer">
        <div className={TACTICAL_VIEW_STYLES.PlayerTimelineScrubber_div_className}>
          <div
            className={TACTICAL_VIEW_STYLES.PlayerTimelineScrubber_div_className_2}
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

      <span className={TACTICAL_VIEW_STYLES.PlayerTimelineScrubber_span_className_2}>
        {formattedDuration}
      </span>
    </div>
  );
};

export default PlayerTimelineScrubber;
