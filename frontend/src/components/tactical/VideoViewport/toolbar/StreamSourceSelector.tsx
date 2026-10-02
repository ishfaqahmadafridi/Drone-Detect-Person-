"use client";

import React from "react";
import { AERIAL_STREAM_SOURCES, GROUND_STREAM_SOURCES } from "@/constants/tactical";
import { StreamSourceSelectorProps, StreamSourceType } from "@/types";
import { Hexagon } from "lucide-react";

export const StreamSourceSelector: React.FC<StreamSourceSelectorProps> = ({
  sourceType,
  viewMode = "aerial",
  onSourceSelect,
}) => {
  const options = viewMode === "ground" ? GROUND_STREAM_SOURCES : AERIAL_STREAM_SOURCES;

  return (
    <div className="relative flex items-center select-none">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 text-xs text-slate-200">
        <Hexagon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="text-slate-400 font-medium">Select source</span>
        <select
          value={sourceType}
          onChange={(e) => onSourceSelect(e.target.value as StreamSourceType)}
          className="bg-transparent text-slate-100 font-mono-code font-semibold outline-none cursor-pointer pr-1"
          aria-label="Select camera feed source"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StreamSourceSelector;
