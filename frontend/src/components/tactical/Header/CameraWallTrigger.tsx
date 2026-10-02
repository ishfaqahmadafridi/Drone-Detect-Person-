"use client";

import React from "react";
import { CameraWallTriggerProps } from "@/types";
import { LayoutGrid } from "lucide-react";

export const CameraWallTrigger: React.FC<CameraWallTriggerProps> = ({ onOpenWall }) => {
  return (
    <button
      onClick={onOpenWall}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display text-xs font-semibold uppercase tracking-wider bg-blue-600/15 hover:bg-blue-600/25 active:bg-blue-600/35 text-blue-200 border border-blue-500/40 hover:border-blue-400/70 transition-all shadow-[0_0_12px_rgba(59,130,246,0.15)] cursor-pointer"
      title="Open Tactical Multi-Camera Wall"
    >
      <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
      <span className="hidden sm:inline">CAMERA WALL</span>
    </button>
  );
};

export default CameraWallTrigger;
