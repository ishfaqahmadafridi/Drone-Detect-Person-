"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
      <div className={TACTICAL_VIEW_STYLES.DetectionModeToggle_div_className}>
        <button
          type="button"
          onClick={() => onTrackingModeChange?.("auto")}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase transition-colors ${
            isAuto
              ? TACTICAL_VIEW_STYLES.DetectionModeToggle_button_className
              : TACTICAL_VIEW_STYLES.RecordingsFilterTabs_button_className_2
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
              ? TACTICAL_VIEW_STYLES.DetectionModeToggle_button_className_2
              : TACTICAL_VIEW_STYLES.RecordingsFilterTabs_button_className_2
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
          className={TACTICAL_VIEW_STYLES.DetectionModeToggle_button_className_3}
          title="Clear all locked targets"
        >
          <X className="w-3 h-3" />
          <span>CLEAR</span>
        </button>
      )}
    </div>
  );
};
