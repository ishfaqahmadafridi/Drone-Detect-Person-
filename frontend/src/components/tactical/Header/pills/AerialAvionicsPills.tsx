"use client";

import React from "react";
import { AerialAvionicsPillsProps } from "@/types";
import { normalizeAvionicsMetrics } from "@/utils";
import { FlightStatePill } from "./FlightStatePill";
import { DroneBatteryPill } from "./DroneBatteryPill";

export const AerialAvionicsPills: React.FC<AerialAvionicsPillsProps> = ({ avionics }) => {
  if (!avionics) return null;

  const {
    flightState,
    battery,
    isAirborne,
    isBatteryLow,
    altitude,
    voltage,
    health,
  } = normalizeAvionicsMetrics(avionics);

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* 1. Drone Airborne & Flight Status Pill */}
      <FlightStatePill
        flightState={flightState}
        isAirborne={isAirborne}
        altitude={altitude}
        heading={avionics.compass_heading_deg || 0}
      />

      {/* 2. Drone 6S Battery Gauge Pill */}
      <DroneBatteryPill
        batteryPct={battery}
        isBatteryLow={isBatteryLow}
        health={health}
        voltage={voltage}
      />
    </div>
  );
};

export default AerialAvionicsPills;
