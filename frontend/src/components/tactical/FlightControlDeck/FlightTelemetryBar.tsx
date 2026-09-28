"use client";

import React from "react";
import { FlightTelemetryBarProps } from "@/types";

export const FlightTelemetryBar: React.FC<FlightTelemetryBarProps> = ({
  altitude,
  batteryPercent,
  flightState,
}) => {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono-code">
      <span className="text-slate-400">
        ALTITUDE: <strong className="text-cyan-400">{altitude.toFixed(1)}m</strong>
      </span>
      <span className="text-slate-400">
        BATTERY:{" "}
        <strong className={batteryPercent > 25 ? "text-emerald-400" : "text-red-400"}>
          {batteryPercent}%
        </strong>
      </span>
      <span className="text-slate-400">
        MODE: <strong className="text-white">{flightState}</strong>
      </span>
    </div>
  );
};

export default FlightTelemetryBar;
