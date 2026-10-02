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
          className={`px-2.5 py-1 rounded text-xs font-mono-code font-medium cursor-pointer transition-all duration-150 active:scale-95 ${
            zoomLevel === zoom
              ? "bg-blue-600/25 text-white border border-blue-500/50 shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
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
