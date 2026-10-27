"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
            ? TACTICAL_VIEW_STYLES.FlightActionGrid_button_className
            : TACTICAL_VIEW_STYLES.FlightActionGrid_button_className_2
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
            ? TACTICAL_VIEW_STYLES.FlightActionGrid_button_className_3
            : TACTICAL_VIEW_STYLES.FlightActionGrid_button_className_4
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
            ? TACTICAL_VIEW_STYLES.FlightActionGrid_button_className_5
            : TACTICAL_VIEW_STYLES.FlightActionGrid_button_className_6
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
            ? TACTICAL_VIEW_STYLES.FlightActionGrid_button_className_7
            : TACTICAL_VIEW_STYLES.FlightActionGrid_button_className_8
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span>RETURN HOME (RTL)</span>
      </button>
    </div>
  );
};

export default FlightActionGrid;
