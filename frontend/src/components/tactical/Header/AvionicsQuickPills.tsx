"use client";

import React from "react";
import { AvionicsQuickPillsProps } from "@/types";
import { Battery, Navigation } from "lucide-react";

export const AvionicsQuickPills: React.FC<AvionicsQuickPillsProps> = ({ avionics }) => {
  if (!avionics) return null;

  const batteryPct = avionics.battery_percent;
  const isBatteryLow = batteryPct < 25;
  const isAirborne = avionics.flight_state === "AIRBORNE" || avionics.flight_state === "PATROL";

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* Flight State Pill */}
      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono-code font-bold tracking-wider uppercase border ${
          isAirborne
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : "bg-slate-800 text-slate-400 border-slate-700"
        }`}
        title={`Drone Altitude: ${avionics.altitude_m.toFixed(1)}m | Heading: ${avionics.compass_heading_deg}°`}
      >
        <Navigation className={`w-3 h-3 ${isAirborne ? "animate-pulse text-emerald-400" : ""}`} />
        <span>{avionics.flight_state}</span>
      </div>

      {/* Battery Health Pill */}
      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono-code font-bold tracking-wider border ${
          isBatteryLow
            ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
            : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
        }`}
        title={`Health: ${avionics.battery_health_percent}% | Voltage: ${avionics.battery_voltage.toFixed(1)}V`}
      >
        <Battery className="w-3.5 h-3.5" />
        <span>{batteryPct}%</span>
      </div>
    </div>
  );
};

export default AvionicsQuickPills;
