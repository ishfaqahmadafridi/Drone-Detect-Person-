"use client";

import React from "react";
import { AirspaceCommandViewProps } from "@/types";
import { VideoViewport } from "../VideoViewport";
import { FlightControlDeck } from "../FlightControlDeck";
import { DroneAvionicsCard } from "../DroneAvionicsCard";
import { TelemetryCards } from "../TelemetryCards";
import { TuningPanel } from "../TuningPanel";
import { IncidentLogs } from "../IncidentLogs";

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
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">
      {/* Left Column: Primary Video Viewport, Mission Flight Deck & Forensic Captures */}
      <div className="flex flex-col gap-4 min-w-0">
        <VideoViewport onSnapshotTrigger={onSnapshotTrigger} />

        <FlightControlDeck
          flightState={flightState}
          altitude={altitude}
          batteryPercent={batteryPercent}
          isCommandPending={isCommandPending}
          onCommand={onCommand}
        />
      </div>

      {/* Right Column: Drone Avionics & Battery, Computer Vision Telemetry, Tuning, Incident Logs */}
      <div className="flex flex-col gap-4 min-w-0">
        <DroneAvionicsCard
          avionics={avionics}
          onOpenFlightDeck={onOpenFlightDeck}
          onConnectAirLink={onConnectAirLink}
        />

        <TelemetryCards />

        <TuningPanel />

        <IncidentLogs />
      </div>
    </div>
  );
};

export default AirspaceCommandView;
