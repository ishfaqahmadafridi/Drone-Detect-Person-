"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
      className={`${TACTICAL_VIEW_STYLES.PlayerControlsBar_div_className}${
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
