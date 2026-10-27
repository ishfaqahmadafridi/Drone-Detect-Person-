"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import { useToggle } from "@/hooks/useToggle";
import React from "react";
import { AirspaceCommandViewProps } from "@/types";
import { useAppSelector } from "@/store";
import { VideoViewport } from "../VideoViewport";
import { DeviceDeckCard } from "../FlightControlDeck";
import { TelemetryCards } from "../TelemetryCards";
import { TuningPanel } from "../TuningPanel";

export const AirspaceCommandView: React.FC<AirspaceCommandViewProps> = ({
  onSnapshotTrigger,
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
  avionics,
  onOpenWall,
  viewMode: propViewMode,
}) => {
  const [isTuningOpen, setIsTuningOpen] = useToggle(false);
  const storeViewMode = useAppSelector((state) => state.telemetry.view_mode);
  const activeViewMode = propViewMode || storeViewMode || "aerial";
  const activeSourceType = useAppSelector((state) => state.telemetry.source_type) || "synthetic";
  const isSimulation = activeSourceType === "synthetic";

  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* 1. Operations Header & Status Pill */}
      <div className={TACTICAL_VIEW_STYLES.AirspaceCommandView_div_className}>
        <div>
          <div className={TACTICAL_VIEW_STYLES.DeviceDeckHeader_div_className}>
            OPERATIONS / SECTOR 04
          </div>
          <h1 className={TACTICAL_VIEW_STYLES.AirspaceCommandView_h1_className}>
            Airspace Command
          </h1>
          <p className={TACTICAL_VIEW_STYLES.AirspaceCommandView_p_className}>
            North perimeter • Sector 04 • Operational overview
          </p>
        </div>

        <div className="flex items-center">
          <span
            className={`px-3 py-1.5 rounded-md text-xs font-mono-code font-bold tracking-wider uppercase border shadow-sm ${
              isSimulation
                ? TACTICAL_VIEW_STYLES.AirspaceCommandView_span_className
                : TACTICAL_VIEW_STYLES.AirspaceCommandView_span_className_2
            }`}
          >
            {isSimulation ? "SIMULATION" : "LIVE LINK"}
          </span>
        </div>
      </div>

      {/* 2. Operations Command Layout: Primary Feed Column + Right Device Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] 2xl:grid-cols-[1fr_360px] gap-5 items-start">
        {/* Left Column: Video Feed, 5-Metric Telemetry Cards */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Primary Optical / Radar Viewport */}
          <VideoViewport onSnapshotTrigger={onSnapshotTrigger} onManageCameras={onOpenWall} />

          {/* 5-Metric Telemetry Cards in a single row */}
          <TelemetryCards viewMode={activeViewMode} layout="horizontal" />
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
