"use client";

import React from "react";
import { Eye } from "lucide-react";
import { SidebarCameraWallTriggerProps } from "@/types";

export const SidebarCameraWallTrigger: React.FC<SidebarCameraWallTriggerProps> = ({
  isCollapsed,
  onOpenWall,
}) => {
  return (
    <div className="mt-2 pt-2 border-t border-slate-800/80">
      <button
        onClick={onOpenWall}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border border-cyan-500/40 text-cyan-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all ${
          isCollapsed ? "justify-center px-0" : ""
        }`}
        title="Launch Tactical Multi-Sensor Camera Wall"
      >
        <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
        {!isCollapsed && <span>CAMERA WALL</span>}
      </button>
    </div>
  );
};
