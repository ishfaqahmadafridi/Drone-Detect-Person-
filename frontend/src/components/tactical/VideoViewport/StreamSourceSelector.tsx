"use client";

import React from "react";
import { STREAM_SOURCE_OPTIONS } from "@/constants/tactical";
import { StreamSourceSelectorProps, StreamSourceType } from "@/types";

export const StreamSourceSelector: React.FC<StreamSourceSelectorProps> = ({
  sourceType,
  onSourceSelect,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono-code text-xs text-slate-400">STREAM SOURCE:</span>
      <div className="flex rounded-md overflow-hidden border border-slate-800">
        {STREAM_SOURCE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSourceSelect(opt.value as StreamSourceType)}
            className={`px-3 py-1 text-xs font-display font-semibold uppercase transition-colors border-r border-slate-800 last:border-r-0 ${
              sourceType === opt.value
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
