"use client";

import React from "react";
import { PerimeterZoomControlProps } from "@/types";
import { PERIMETER_ZOOM_PRESETS } from "@/constants/tactical";
import { ZoomIn } from "lucide-react";

export const PerimeterZoomControl: React.FC<PerimeterZoomControlProps> = ({
  activeZoom,
  onZoomChange,
}) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/60 border border-slate-800">
      <div className="px-1 text-slate-500">
        <ZoomIn className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 grid grid-cols-3 gap-1">
        {PERIMETER_ZOOM_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.value}
            onClick={() => onZoomChange(preset.value)}
            aria-pressed={activeZoom === preset.value}
            className={`py-1 px-1.5 text-[10px] font-mono-code font-bold rounded transition-all cursor-pointer ${
              activeZoom === preset.value
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
            }`}
            title={`Switch to ${preset.label}`}
          >
            {preset.label.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PerimeterZoomControl;
