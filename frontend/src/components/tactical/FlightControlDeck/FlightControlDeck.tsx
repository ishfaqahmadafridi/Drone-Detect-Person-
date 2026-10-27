"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { FlightControlDeckProps } from "@/types";
import { FlightDeckHeader } from "./FlightDeckHeader";
import { FlightTelemetryBar } from "./FlightTelemetryBar";
import { FlightActionGrid } from "./FlightActionGrid";
import { DroneMovementPanel } from "./manual/DroneMovementPanel";

export const FlightControlDeck: React.FC<FlightControlDeckProps> = ({
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.DroneAvionicsCard_div_className}>
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
      <DroneMovementPanel />
    </div>
  );
};

export default FlightControlDeck;
export * from "./FlightDeckHeader";
export * from "./FlightTelemetryBar";
export * from "./FlightActionGrid";
export * from "./DeviceDeckCard";
