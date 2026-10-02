"use client";

import React from "react";
import { StreamZoomControlsProps } from "@/types";

export const StreamZoomControls: React.FC<StreamZoomControlsProps> = ({
  zoomLevel,
  onZoomChange,
}) => {
  const presets = [1.0, 2.0, 4.0];

  return (
    <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 select-none">
      {presets.map((zoom) => (
        <button
          key={zoom}
          onClick={() => onZoomChange(zoom)}
          className={`px-2.5 py-1 rounded text-xs font-mono-code font-medium transition-colors ${
            zoomLevel === zoom
              ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
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
