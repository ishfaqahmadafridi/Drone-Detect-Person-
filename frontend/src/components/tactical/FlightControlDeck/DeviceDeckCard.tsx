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
  avionics,
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
  viewMode = "aerial",
  onToggleTuning,
  isTuningOpen = false,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.DeviceDeckCard_div_className}>
      {/* 1. Header Cluster */}
      <DeviceDeckHeader viewMode={viewMode} />

      {/* 2. Sensor Telemetry 2-Column Grid */}
      <DeviceDeckGrid
        altitude={altitude}
        altitudeM={avionics?.altitude_m}
        groundSpeedMs={avionics?.ground_speed_ms}
        compassHeadingDeg={avionics?.compass_heading_deg}
        gpsSats={avionics?.gps_sats}
        batteryPercent={batteryPercent || avionics?.battery_percent}
        latencyMs={48}
        viewMode={viewMode}
      />

      {/* 3. Flight / Sensor Control 2x2 Grid */}
      <DeviceDeckActions
        flightState={flightState}
        isCommandPending={isCommandPending}
        onCommand={onCommand}
        viewMode={viewMode}
      />

      {/* 4. Detection Tuning Trigger */}
      {viewMode === "aerial" && <DroneMovementPanel />}
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
