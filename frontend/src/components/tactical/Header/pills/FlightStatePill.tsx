"use client";

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
          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
          : "bg-slate-800/70 text-slate-300 border-slate-700/60"
      }`}
      title={`Altitude: ${altitude.toFixed(1)}m • Heading: ${heading}°`}
    >
      <Navigation className="w-3 h-3 text-slate-400" />
      <span className="capitalize">{flightState.toLowerCase()}</span>
    </div>
  );
};

export default FlightStatePill;
