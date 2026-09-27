"use client";

import React from "react";
import { ViewportHeaderProps } from "@/types";
import { Maximize, Camera, Edit3 } from "lucide-react";

export const ViewportHeader: React.FC<ViewportHeaderProps> = ({
  sourceType,
  isEditingZone,
  onToggleEditZone,
  onSnapshotTrigger,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center justify-between p-3 px-4 bg-slate-950/60 border-b border-slate-800">
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <h2 className="font-display font-bold text-sm tracking-wider text-white uppercase">
          PRIMARY OPTICAL SENSOR
        </h2>
        <span className="font-mono-code text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
          {sourceType.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleEditZone}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-display font-semibold uppercase tracking-wider transition-all ${
            isEditingZone
              ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,242,254,0.5)]"
              : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/20"
          }`}
          title="Toggle interactive restricted zone canvas"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditingZone ? "Active Editing" : "Edit Restricted Zone"}</span>
        </button>

        <button
          onClick={onSnapshotTrigger}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-display bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500"
          title="Trigger Instant Evidence Snapshot"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500"
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen View"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
