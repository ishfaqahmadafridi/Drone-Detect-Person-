"use client";

import React from "react";
import { VIDEO_TOOLS } from "@/constants/tactical";
import { StreamFilterControlsProps } from "@/types";

export const StreamFilterControls: React.FC<StreamFilterControlsProps> = ({ isNightVision, onToggleNightVision }) => {
  const state = isNightVision ? "on" : "off";
  return (
    <label className={VIDEO_TOOLS.groupClass}>
      <span className={VIDEO_TOOLS.groupLabelClass}>Night vision</span>
      <button
        type="button"
        role="switch"
        aria-checked={isNightVision}
        onClick={onToggleNightVision}
        className={VIDEO_TOOLS.switchTrackClass[state]}
      >
        <span aria-hidden="true" className={VIDEO_TOOLS.switchThumbClass[state]} />
      </button>
    </label>
  );
};

export default StreamFilterControls;
