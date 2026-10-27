"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { StreamZoomControlsProps } from "@/types";

export const StreamZoomControls: React.FC<StreamZoomControlsProps> = ({
  zoomLevel,
  onZoomChange,
}) => {
  const presets = [1.0, 2.0, 4.0];

  return (
    <div className={TACTICAL_VIEW_STYLES.StreamZoomControls_div_className}>
      {presets.map((zoom) => (
        <button
          key={zoom}
          onClick={() => onZoomChange(zoom)}
          className={`px-2.5 py-1 rounded text-xs font-mono-code font-medium cursor-pointer transition-all duration-150 active:scale-95 ${
            zoomLevel === zoom
              ? TACTICAL_VIEW_STYLES.StreamZoomControls_button_className
              : TACTICAL_VIEW_STYLES.StreamZoomControls_button_className_2
          }`}
          title={`Set Optical Zoom to ${zoom}x`}
        >
          {zoom}x
        </button>
      ))}
    </div>
  );
};

export default StreamZoomControls;
