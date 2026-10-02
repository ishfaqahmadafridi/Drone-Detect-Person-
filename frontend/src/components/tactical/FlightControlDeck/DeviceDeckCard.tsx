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
  isTuningOpen = false,
}) => {
  return (
    <div className="p-5 rounded-xl border border-slate-700/60 bg-[#0F141F] flex flex-col gap-5 select-none shadow-lg">
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
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] ${
            isTuningOpen
              ? "border-blue-500/50 bg-blue-600/20 text-white shadow-sm font-semibold"
              : "border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200 hover:text-white"
          }`}
        >
          <span>Detection tuning</span>
          <SlidersHorizontal className={`w-3.5 h-3.5 ${isTuningOpen ? "text-blue-400" : "text-slate-400"}`} />
        </button>
      )}
    </div>
  );
};

export default DeviceDeckCard;
export * from "./DeviceDeckHeader";
export * from "./DeviceDeckGrid";
export * from "./DeviceDeckActions";
