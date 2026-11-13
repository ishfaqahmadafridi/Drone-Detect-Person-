"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { DeviceDeckCardProps } from "@/types";
import { DeviceDeckHeader } from "./DeviceDeckHeader";
import { DeviceDeckGrid } from "./DeviceDeckGrid";
import { DeviceDeckActions } from "./DeviceDeckActions";
import { SlidersHorizontal } from "lucide-react";
import { DroneMovementPanel } from "./manual/DroneMovementPanel";

export const DeviceDeckCard: React.FC<DeviceDeckCardProps> = ({
  isCommandPending,
  onCommand,
  viewMode = "aerial",
  onToggleTuning,
  isTuningOpen = false,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.DeviceDeckCard_div_className}>
      {viewMode === "ground" ? (
        <>
          <DeviceDeckHeader viewMode={viewMode} />
          <DeviceDeckGrid />
          <DeviceDeckActions isCommandPending={isCommandPending} onCommand={onCommand} viewMode={viewMode} />
        </>
      ) : <DroneMovementPanel />}

      {/* Detection tuning */}
      {onToggleTuning && (
        <button
          onClick={onToggleTuning}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] ${
            isTuningOpen
              ? TACTICAL_VIEW_STYLES.DeviceDeckCard_button_className
              : TACTICAL_VIEW_STYLES.DeviceDeckCard_button_className_2
          }`}
        >
          <span>Detection tuning</span>
          <SlidersHorizontal className={`w-3.5 h-3.5 ${isTuningOpen ? TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className : TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className_3}`} />
        </button>
      )}
    </div>
  );
};

export default DeviceDeckCard;
export * from "./DeviceDeckHeader";
export * from "./DeviceDeckGrid";
export * from "./DeviceDeckActions";
