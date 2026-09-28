"use client";

import React from "react";
import { PerspectiveToggleProps } from "@/types";

export const PerspectiveToggle: React.FC<PerspectiveToggleProps> = ({
  viewMode = "aerial",
  onViewSelect,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono-code text-xs text-slate-400">PERSPECTIVE:</span>
      <div className="flex rounded-md overflow-hidden border border-slate-800">
        <button
          onClick={() => onViewSelect("aerial")}
          className={`px-3 py-1 text-xs font-display font-semibold uppercase transition-colors border-r border-slate-800 ${
            viewMode === "aerial"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          AERIAL DRONE
        </button>
        <button
          onClick={() => onViewSelect("ground")}
          className={`px-3 py-1 text-xs font-display font-semibold uppercase transition-colors ${
            viewMode === "ground"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          GROUND CCTV
        </button>
      </div>
    </div>
  );
};
