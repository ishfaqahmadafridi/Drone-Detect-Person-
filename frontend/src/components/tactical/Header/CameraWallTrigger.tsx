"use client";

import React from "react";
import { CameraWallTriggerProps } from "@/types";
import { LayoutGrid } from "lucide-react";

export const CameraWallTrigger: React.FC<CameraWallTriggerProps> = ({ onOpenWall }) => {
  return (
    <button
      onClick={onOpenWall}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-200 border border-cyan-500/50 hover:from-cyan-600/40 hover:to-blue-600/40 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
      title="Open Tactical Multi-Camera Wall"
    >
      <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
      <span className="hidden sm:inline">CAMERA WALL</span>
    </button>
  );
};

export default CameraWallTrigger;
