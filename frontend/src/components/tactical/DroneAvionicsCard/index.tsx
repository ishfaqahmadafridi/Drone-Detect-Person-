"use client";

import React from "react";
import { DroneAvionicsCardProps } from "@/types";
import { normalizeAvionicsMetrics } from "@/utils";
import { AvionicsCardHeader } from "./AvionicsCardHeader";
import { BatteryHealthGauge } from "./BatteryHealthGauge";
import { FlightPhysicsGrid } from "./FlightPhysicsGrid";
import { OpticalSensorStatus } from "./OpticalSensorStatus";
import { AvionicsActionButtons } from "./AvionicsActionButtons";

export const DroneAvionicsCard: React.FC<DroneAvionicsCardProps> = ({
  avionics,
  onOpenFlightDeck,
  onOpenWebcam,
}) => {
  const {
    flightState,
    battery,
    voltage,
    health,
    altitude,
    speed,
    sats,
    flightTime,
    camOnline,
    camDetecting,
  } = normalizeAvionicsMetrics(avionics);

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3.5 border border-slate-800 interactive-tactical-tile">
      {/* 1. Header: Flight State Badge & Pulse */}
      <AvionicsCardHeader flightState={flightState} />

      {/* 2. Battery Health Gauge */}
      <BatteryHealthGauge
        battery={battery}
        voltage={voltage}
        health={health}
        flightTime={flightTime}
      />

      {/* 3. Flight Telemetry Physics Matrix */}
      <FlightPhysicsGrid altitude={altitude} speed={speed} sats={sats} />

      {/* 4. Optical Sensor Condition */}
      <OpticalSensorStatus camOnline={camOnline} camDetecting={camDetecting} />

      {/* 5. Quick Avionics Action Buttons */}
      <AvionicsActionButtons
        onOpenFlightDeck={onOpenFlightDeck}
        onOpenWebcam={onOpenWebcam}
      />
    </div>
  );
};

export default DroneAvionicsCard;
export * from "./AvionicsCardHeader";
export * from "./BatteryHealthGauge";
export * from "./FlightPhysicsGrid";
export * from "./OpticalSensorStatus";
export * from "./AvionicsActionButtons";
