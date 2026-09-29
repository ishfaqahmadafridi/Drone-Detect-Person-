"use client";

import React from "react";
import { FlightControlDeckProps } from "@/types";
import { FlightDeckHeader } from "./FlightDeckHeader";
import { FlightTelemetryBar } from "./FlightTelemetryBar";
import { FlightActionGrid } from "./FlightActionGrid";

export const FlightControlDeck: React.FC<FlightControlDeckProps> = ({
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
}) => {
  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3.5 border border-slate-800 interactive-tactical-tile">
      {/* 1. Deck Header */}
      <FlightDeckHeader />

      {/* 2. Telemetry Quick Bar */}
      <FlightTelemetryBar
        altitude={altitude}
        batteryPercent={batteryPercent}
        flightState={flightState}
      />

      {/* 3. Flight Control Directives Grid */}
      <FlightActionGrid
        flightState={flightState}
        isCommandPending={isCommandPending}
        onCommand={onCommand}
      />
    </div>
  );
};

export default FlightControlDeck;
export * from "./FlightDeckHeader";
export * from "./FlightTelemetryBar";
export * from "./FlightActionGrid";
