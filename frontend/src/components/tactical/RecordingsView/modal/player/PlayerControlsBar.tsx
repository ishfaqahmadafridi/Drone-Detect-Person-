"use client";

import React from "react";
import { PlayerControlsBarProps } from "@/types";
import { PlayerTimelineScrubber } from "./PlayerTimelineScrubber";
import { PlayerTransportControls } from "./PlayerTransportControls";
import { PlayerActionControls } from "./PlayerActionControls";

export const PlayerControlsBar: React.FC<PlayerControlsBarProps> = ({
  scrubberProps,
  transportProps,
  actionProps,
  isDisabled = false,
}) => {
  return (
    <div
      className={`w-full bg-slate-950/95 border-t border-slate-800/90 px-4 py-3 flex flex-col gap-2 z-20 backdrop-blur-md transition-opacity ${
        isDisabled ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {/* 1. Timeline Scrubber */}
      <PlayerTimelineScrubber {...scrubberProps} isDisabled={isDisabled} />

      {/* 2. Transport & Action Controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <PlayerTransportControls {...transportProps} isDisabled={isDisabled} />
        <PlayerActionControls {...actionProps} isDisabled={isDisabled} />
      </div>
    </div>
  );
};

export default PlayerControlsBar;
