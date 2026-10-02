"use client";

import React from "react";
import { Eye } from "lucide-react";
import { SidebarCameraWallTriggerProps } from "@/types";

export const SidebarCameraWallTrigger: React.FC<SidebarCameraWallTriggerProps> = ({
  isCollapsed,
  onOpenWall,
}) => {
  return (
    <div className="mt-2 pt-2 border-t border-slate-700/60">
      <button
        onClick={onOpenWall}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wider bg-blue-600/15 hover:bg-blue-600/25 active:bg-blue-600/35 border border-blue-500/40 text-blue-200 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all cursor-pointer ${
          isCollapsed ? "justify-center px-0" : ""
        }`}
        title="Launch Tactical Multi-Sensor Camera Wall"
      >
        <Eye className="w-4 h-4 text-blue-400 shrink-0" />
        {!isCollapsed && <span>CAMERA WALL</span>}
      </button>
    </div>
  );
};
