"use client";

import React from "react";
import { DetectionModeToggleProps } from "@/types";
import { Sparkles, Crosshair, X } from "lucide-react";

export const DetectionModeToggle: React.FC<DetectionModeToggleProps> = ({
  trackingMode = "auto",
  selectedCount = 0,
  onTrackingModeChange,
  onClearSelectedTargets,
}) => {
  const isAuto = trackingMode === "auto";
  const isManual = trackingMode === "manual";

  return (
    <div className="flex items-center gap-1.5 ml-1">
      {/* Segmented Auto/Manual Button Group */}
      <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-md p-0.5 shadow-inner">
        <button
          type="button"
          onClick={() => onTrackingModeChange?.("auto")}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase transition-colors ${
            isAuto
              ? "bg-cyan-500 text-slate-950 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Auto Detection: Continuously detects and boxes all visible persons"
        >
          <Sparkles className="w-3 h-3" />
          <span>AUTO</span>
        </button>

        <button
          type="button"
          onClick={() => onTrackingModeChange?.("manual")}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase transition-colors ${
            isManual
              ? "bg-amber-400 text-slate-950 shadow-sm font-extrabold"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Manual Detection: Click on each person on screen to lock on and draw bounding box"
        >
          <Crosshair className="w-3 h-3" />
          <span>MANUAL{selectedCount > 0 ? ` (${selectedCount})` : ""}</span>
        </button>
      </div>

      {/* Clear Selected Targets Action Button */}
      {isManual && selectedCount > 0 && onClearSelectedTargets && (
        <button
          type="button"
          onClick={onClearSelectedTargets}
          className="flex items-center gap-1 text-[10px] text-amber-400/90 hover:text-amber-300 font-mono-code border border-amber-500/30 px-1.5 py-0.5 rounded hover:bg-amber-500/15 transition-colors"
          title="Clear all locked targets"
        >
          <X className="w-3 h-3" />
          <span>CLEAR</span>
        </button>
      )}
    </div>
  );
};
