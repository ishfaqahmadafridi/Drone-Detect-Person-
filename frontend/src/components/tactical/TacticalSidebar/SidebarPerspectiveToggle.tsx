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
      <div className="mt-2.5 flex flex-col items-center gap-1.5 p-1 select-none">
        <button
          onClick={() => onViewSelect("aerial")}
          title="Perspective: Aerial Drone Model"
          aria-label="Perspective: Aerial Drone Model"
          className={`p-2 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 ${
            viewMode === "aerial"
              ? "bg-blue-600/20 text-white border border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
              : "bg-slate-900/60 text-slate-500 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 hover:border-slate-700"
          }`}
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewSelect("ground")}
          title="Perspective: Ground CCTV Model"
          aria-label="Perspective: Ground CCTV Model"
          className={`p-2 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 ${
            viewMode === "ground"
              ? "bg-blue-600/20 text-white border border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
              : "bg-slate-900/60 text-slate-500 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 hover:border-slate-700"
          }`}
        >
          <Video className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 pt-3 pb-2 select-none">
      <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400 font-semibold mb-2">
        PERSPECTIVE
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onViewSelect("aerial")}
          title="Switch to Aerial Drone Perspective (UAV Flight Model)"
          className={`flex items-center justify-center py-2 px-2 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] ${
            viewMode === "aerial"
              ? "bg-blue-600/20 text-white border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.2)] font-semibold"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <span>Aerial Drone</span>
        </button>

        <button
          onClick={() => onViewSelect("ground")}
          title="Switch to Ground CCTV Perspective (Perimeter Camera Model)"
          className={`flex items-center justify-center py-2 px-2 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] ${
            viewMode === "ground"
              ? "bg-blue-600/20 text-white border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.2)] font-semibold"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <span>Ground CCTV</span>
        </button>
      </div>
    </div>
  );
};


export default SidebarPerspectiveToggle;
