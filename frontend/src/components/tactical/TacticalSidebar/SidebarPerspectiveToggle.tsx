"use client";

import React from "react";
import { SidebarPerspectiveToggleProps } from "@/types";
import { Crosshair, Video } from "lucide-react";

export const SidebarPerspectiveToggle: React.FC<SidebarPerspectiveToggleProps> = ({
  viewMode,
  onViewSelect,
  isCollapsed,
}) => {
  if (isCollapsed) {
    return (
      <div className="mt-2.5 flex flex-col items-center gap-1.5 p-1">
        <button
          onClick={() => onViewSelect("aerial")}
          title="Perspective: Aerial Drone Model"
          aria-label="Perspective: Aerial Drone Model"
          className={`p-2 rounded-lg transition-all ${
            viewMode === "aerial"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              : "bg-slate-900/80 text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewSelect("ground")}
          title="Perspective: Ground CCTV Model"
          aria-label="Perspective: Ground CCTV Model"
          className={`p-2 rounded-lg transition-all ${
            viewMode === "ground"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              : "bg-slate-900/80 text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Video className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 px-1">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[10px] font-mono-code tracking-wider text-slate-400 uppercase">
          VISION PERSPECTIVE
        </span>
        <span
          className={`text-[9px] font-mono-code font-bold uppercase px-1.5 py-0.5 rounded ${
            viewMode === "aerial"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
          }`}
        >
          {viewMode === "aerial" ? "UAV 90°" : "CCTV HORIZ"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-900/80 border border-slate-800">
        <button
          onClick={() => onViewSelect("aerial")}
          title="Switch to Aerial Drone Perspective (UAV Flight Model)"
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-display font-bold tracking-wide transition-all ${
            viewMode === "aerial"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Crosshair className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
          <span>AERIAL</span>
        </button>

        <button
          onClick={() => onViewSelect("ground")}
          title="Switch to Ground CCTV Perspective (Perimeter Camera Model)"
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-display font-bold tracking-wide transition-all ${
            viewMode === "ground"
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Video className="w-3.5 h-3.5 shrink-0 text-blue-400" />
          <span>GROUND</span>
        </button>
      </div>
    </div>
  );
};


export default SidebarPerspectiveToggle;
