"use client";

import React from "react";
import { DeviceDeckCardProps } from "@/types";
import { DeviceDeckHeader } from "./DeviceDeckHeader";
import { DeviceDeckGrid } from "./DeviceDeckGrid";
import { DeviceDeckActions } from "./DeviceDeckActions";
import { SlidersHorizontal } from "lucide-react";

export const DeviceDeckCard: React.FC<DeviceDeckCardProps> = ({
  avionics,
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
  viewMode = "aerial",
  onToggleTuning,
}) => {
  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col gap-5 select-none">
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
      {onToggleTuning && (
        <button
          onClick={onToggleTuning}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
        >
          <span>Detection tuning</span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </div>
  );
};

export default DeviceDeckCard;
export * from "./DeviceDeckHeader";
export * from "./DeviceDeckGrid";
export * from "./DeviceDeckActions";
