"use client";

import React from "react";
import { VIDEO_TOOLS } from "@/constants/tactical";
import { StreamZoomControlsProps } from "@/types";

export const StreamZoomControls: React.FC<StreamZoomControlsProps> = ({ zoomLevel, onZoomChange }) => (
  <div className={VIDEO_TOOLS.groupClass}>
    <span id="video-zoom-label" className={VIDEO_TOOLS.groupLabelClass}>Zoom</span>
    <div role="group" aria-labelledby="video-zoom-label" className={VIDEO_TOOLS.segmentedClass}>
      {VIDEO_TOOLS.zoomLevels.map((zoom) => (
        <button
          key={zoom}
          type="button"
          aria-pressed={zoomLevel === zoom}
          onClick={() => onZoomChange(zoom)}
          className={zoomLevel === zoom ? VIDEO_TOOLS.segmentClass.active : VIDEO_TOOLS.segmentClass.idle}
        >
          {zoom}×
        </button>
      ))}
    </div>
  </div>
);

export default StreamZoomControls;
