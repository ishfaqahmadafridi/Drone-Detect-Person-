"use client";

import React, { useState } from "react";
import { AirspaceCommandViewProps } from "@/types";
import { useAppSelector } from "@/store";
import { VideoViewport } from "../VideoViewport";
import { DeviceDeckCard } from "../FlightControlDeck";
import { TelemetryCards } from "../TelemetryCards";
import { RecentIncidentsTable } from "../IncidentLogs";
import { TuningPanel } from "../TuningPanel";

export const AirspaceCommandView: React.FC<AirspaceCommandViewProps> = ({
  onSnapshotTrigger,
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
  avionics,
  viewMode: propViewMode,
  onTabChange,
}) => {
  const [isTuningOpen, setIsTuningOpen] = useState(false);
  const storeViewMode = useAppSelector((state) => state.telemetry.view_mode);
  const activeViewMode = propViewMode || storeViewMode || "aerial";
  const activeSourceType = useAppSelector((state) => state.telemetry.source_type) || "synthetic";
  const isSimulation = activeSourceType === "synthetic";

  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* 1. Operations Header & Status Pill */}
      <div className="flex items-center justify-between pb-1 select-none">
        <div>
          <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400 font-semibold">
            OPERATIONS / SECTOR 04
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-0.5">
            Airspace Command
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            North perimeter • Sector 04 • Operational overview
          </p>
        </div>

        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-md text-xs font-mono-code font-bold tracking-wider uppercase border ${
              isSimulation
                ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-400"
                : "border-blue-500/40 bg-blue-950/20 text-blue-400"
            }`}
          >
            {isSimulation ? "SIMULATION" : "LIVE LINK"}
          </span>
        </div>
      </div>

      {/* 2. Operations Command Layout: Primary Feed Column + Right Device Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] 2xl:grid-cols-[1fr_360px] gap-5 items-start">
        {/* Left Column: Video Feed, 5-Metric Telemetry Cards, Event Stream Table */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Primary Optical / Radar Viewport */}
          <VideoViewport onSnapshotTrigger={onSnapshotTrigger} />

          {/* 5-Metric Telemetry Cards in a single row */}
          <TelemetryCards viewMode={activeViewMode} layout="horizontal" />

          {/* Recent Incidents Forensic Table */}
          <RecentIncidentsTable
            onViewAll={() => onTabChange?.("incidents")}
            onOpenEvidence={() => onTabChange?.("recordings")}
          />

          {/* Operational Advisory Note */}
          <div className="text-[11px] font-mono-code text-slate-400 px-1 py-1 select-none">
            Simulation mode • Evidence is locally retained • Operator session active
          </div>
        </div>

        {/* Right Column: Device Deck (Flight Telemetry, Directives Grid & Calibration) */}
        <div className="flex flex-col gap-4 min-w-0">
          <DeviceDeckCard
            avionics={avionics}
            flightState={flightState}
            altitude={altitude}
            batteryPercent={batteryPercent}
            isCommandPending={isCommandPending}
            onCommand={onCommand}
            viewMode={activeViewMode}
            isTuningOpen={isTuningOpen}
            onToggleTuning={() => setIsTuningOpen(!isTuningOpen)}
          />

          {/* Expandable Detection Tuning Panel */}
          {isTuningOpen && <TuningPanel />}
        </div>
      </div>
    </div>
  );
};

export default AirspaceCommandView;
