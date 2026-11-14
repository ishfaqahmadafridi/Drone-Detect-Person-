"use client";
import { COMMAND_VIEW_TITLES, TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import { useToggle } from "@/hooks/useToggle";
import React from "react";
import { AirspaceCommandViewProps } from "@/types";
import { useAppSelector } from "@/store";
import { VideoViewport } from "../VideoViewport";
import { DeviceDeckCard } from "../FlightControlDeck";
import { TelemetryCards } from "../TelemetryCards";
import { TuningPanel } from "../TuningPanel";
import { SuspectSelection } from "../VideoViewport/SuspectSelection";
import { usePerspectiveSelection } from "@/hooks/usePerspectiveSelection";

export const AirspaceCommandView: React.FC<AirspaceCommandViewProps> = ({
  onSnapshotTrigger,
  onOpenWall,
  viewMode: propViewMode,
}) => {
  const [isTuningOpen, setIsTuningOpen] = useToggle(false);
  const selectPerspective = usePerspectiveSelection();
  const storeViewMode = useAppSelector((state) => state.telemetry.view_mode);
  const activeViewMode = propViewMode || storeViewMode || "aerial";
  const activeSourceType = useAppSelector((state) => state.telemetry.source_type) || "synthetic";
  const isSimulation = activeSourceType === "synthetic";

  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* 1. Operations Header & Status Pill */}
      <div className={TACTICAL_VIEW_STYLES.AirspaceCommandView_div_className}>
        <h1 className={TACTICAL_VIEW_STYLES.AirspaceCommandView_h1_className}>
          {COMMAND_VIEW_TITLES[activeViewMode]}
        </h1>

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

      {/* 2. Mission metrics summary, directly under the heading */}
      <TelemetryCards viewMode={activeViewMode} layout="horizontal" />

      {/* 3. Operations Command Layout: Primary Feed Column + Right Device Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] 2xl:grid-cols-[1fr_360px] gap-5 items-start">
        {/* Left Column: Video Feed */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Primary Optical / Radar Viewport */}
          <VideoViewport onSnapshotTrigger={onSnapshotTrigger} onManageCameras={onOpenWall} />
        </div>

        {/* Right Column: Device Deck (Flight Telemetry, Directives Grid & Calibration) */}
        <div className="flex flex-col gap-4 min-w-0">
          <DeviceDeckCard
            viewMode={activeViewMode}
            isTuningOpen={isTuningOpen}
            onToggleTuning={() => setIsTuningOpen(open => !open)}
          />

          {/* Expandable Detection Tuning Panel */}
          {isTuningOpen && <TuningPanel />}

          {/* Ground only: pick the suspect the drone will search for */}
          {activeViewMode === "ground" && (
            <SuspectSelection key="ground" channel="ground" onOpenAerialView={() => void selectPerspective("aerial")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AirspaceCommandView;
