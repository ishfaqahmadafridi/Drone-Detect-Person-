"use client";

import React from "react";
import { ViewportHeaderActionsProps } from "@/types";
import { Maximize, Camera } from "lucide-react";

export const ViewportHeaderActions: React.FC<ViewportHeaderActionsProps> = ({
  onSnapshotTrigger,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onSnapshotTrigger}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-display bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 transition-colors"
        title="Trigger Instant Evidence Snapshot"
      >
        <Camera className="w-3.5 h-3.5 text-cyan-400" />
        <span>Snap</span>
      </button>

      <button
        onClick={onToggleFullscreen}
        className="p-1.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 transition-colors"
        title="Toggle Fullscreen"
        aria-label="Toggle Fullscreen View"
      >
        <Maximize className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
