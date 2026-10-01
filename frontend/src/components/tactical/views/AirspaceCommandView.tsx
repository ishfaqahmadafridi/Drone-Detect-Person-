"use client";

import React from "react";
import { AirspaceCommandViewProps } from "@/types";
import { useAppSelector } from "@/store";
import { VideoViewport } from "../VideoViewport";
import { FlightControlDeck } from "../FlightControlDeck";
import { PerimeterSecurityDeck } from "../PerimeterSecurityDeck";
import { DroneAvionicsCard } from "../DroneAvionicsCard";
import { PerimeterCameraCard } from "../PerimeterCameraCard";
import { TelemetryCards } from "../TelemetryCards";
import { TuningPanel } from "../TuningPanel";

import { useStreamMutation } from "@/services/queries/useStreamMutation";

export const AirspaceCommandView: React.FC<AirspaceCommandViewProps> = ({
  onSnapshotTrigger,
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
  onConnectAirLink,
  onOpenFlightDeck,
  avionics,
  viewMode: propViewMode,
  onOpenWall,
}) => {
  const storeViewMode = useAppSelector((state) => state.telemetry.view_mode);
  const activeViewMode = propViewMode || storeViewMode || "aerial";
  const isGround = activeViewMode === "ground";
  const activeSourceType = useAppSelector((state) => state.telemetry.source_type) || "synthetic";
  const { switchSource } = useStreamMutation();

  const handleReconnectGround = async () => {
    await switchSource.mutateAsync({
      sourceType: activeSourceType,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">
      {/* Left Column: Primary Video Viewport, Mission Directives Deck & Forensic Captures */}
      <div className="flex flex-col gap-4 min-w-0">
        <VideoViewport onSnapshotTrigger={onSnapshotTrigger} />

        {isGround ? (
          <PerimeterSecurityDeck
            onReconnectStream={handleReconnectGround}
            onSnapshotTrigger={onSnapshotTrigger}
          />
        ) : (
          <FlightControlDeck
            flightState={flightState}
            altitude={altitude}
            batteryPercent={batteryPercent}
            isCommandPending={isCommandPending}
            onCommand={onCommand}
          />
        )}
      </div>

      {/* Right Column: Sensor Specs & Telemetry, CV Analytics, Tuning, Incident Logs */}
      <div className="flex flex-col gap-4 min-w-0">
        {isGround ? (
          <PerimeterCameraCard
            onOpenWall={onOpenWall || onOpenFlightDeck}
            onReconnectStream={handleReconnectGround}
          />
        ) : (
          <DroneAvionicsCard
            avionics={avionics}
            onOpenFlightDeck={onOpenFlightDeck}
            onConnectAirLink={onConnectAirLink}
          />
        )}

        <TelemetryCards viewMode={activeViewMode} />

        <TuningPanel />
      </div>
    </div>
  );
};

export default AirspaceCommandView;
