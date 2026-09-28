"use client";

import React from "react";
import { FlightActionGridProps } from "@/types";
import { Rocket, ShieldAlert, Home, Radio } from "lucide-react";

export const FlightActionGrid: React.FC<FlightActionGridProps> = ({
  flightState,
  isCommandPending,
  onCommand,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onCommand("takeoff")}
        disabled={isCommandPending}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border font-display text-xs font-semibold uppercase tracking-wider transition-all ${
          flightState === "AIRBORNE"
            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            : "bg-slate-900 border-slate-700/80 text-slate-300 hover:border-emerald-400/60 hover:text-emerald-300"
        }`}
      >
        <Rocket className="w-3.5 h-3.5" />
        <span>LAUNCH / TAKEOFF</span>
      </button>

      <button
        onClick={() => onCommand("patrol")}
        disabled={isCommandPending}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border font-display text-xs font-semibold uppercase tracking-wider transition-all ${
          flightState === "PATROL"
            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            : "bg-slate-900 border-slate-700/80 text-slate-300 hover:border-cyan-400/60 hover:text-cyan-300"
        }`}
      >
        <Radio className="w-3.5 h-3.5" />
        <span>PATROL AIRSPACE</span>
      </button>

      <button
        onClick={() => onCommand("hover")}
        disabled={isCommandPending}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border font-display text-xs font-semibold uppercase tracking-wider transition-all ${
          flightState === "HOVER"
            ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
            : "bg-slate-900 border-slate-700/80 text-slate-300 hover:border-amber-400/60 hover:text-amber-300"
        }`}
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>HOVER / LOITER</span>
      </button>

      <button
        onClick={() => onCommand("rtl")}
        disabled={isCommandPending}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border font-display text-xs font-semibold uppercase tracking-wider transition-all ${
          flightState === "RTL"
            ? "bg-red-500/20 border-red-400 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
            : "bg-slate-900 border-slate-700/80 text-slate-300 hover:border-red-400/60 hover:text-red-300"
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span>RETURN HOME (RTL)</span>
      </button>
    </div>
  );
};

export default FlightActionGrid;
