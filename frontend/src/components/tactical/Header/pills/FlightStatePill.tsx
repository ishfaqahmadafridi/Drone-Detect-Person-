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
      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono-code font-bold tracking-wider uppercase border ${
        isAirborne
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          : "bg-slate-800 text-slate-400 border-slate-700"
      }`}
      title={`Drone Altitude: ${altitude.toFixed(1)}m | Heading: ${heading}°`}
    >
      <Navigation className={`w-3 h-3 ${isAirborne ? "animate-pulse text-emerald-400" : ""}`} />
      <span>{flightState}</span>
    </div>
  );
};

export default FlightStatePill;
