"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { FlightStatePillProps } from "@/types";
import { Navigation } from "lucide-react";

export const FlightStatePill: React.FC<FlightStatePillProps> = ({
  flightState,
  isAirborne,
  altitude,
  heading,
}) => {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono-code font-medium border ${
        isAirborne
          ? TACTICAL_VIEW_STYLES.FlightStatePill_div_className
          : TACTICAL_VIEW_STYLES.DroneBatteryPill_div_className_2
      }`}
      title={`Altitude: ${altitude.toFixed(1)}m • Heading: ${heading}°`}
    >
      <Navigation className={TACTICAL_VIEW_STYLES.FlightStatePill_Navigation_className} />
      <span className="capitalize">{flightState.toLowerCase()}</span>
    </div>
  );
};

export default FlightStatePill;
