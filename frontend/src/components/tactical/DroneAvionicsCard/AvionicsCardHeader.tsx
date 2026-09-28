"use client";

import React from "react";
import { AvionicsCardHeaderProps } from "@/types";
import { getFlightStateColor } from "@/utils";

export const AvionicsCardHeader: React.FC<AvionicsCardHeaderProps> = ({ flightState }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative w-3 h-3 rounded-full bg-emerald-400 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </div>
        <span className="font-display font-bold text-sm tracking-wide text-white uppercase">
          DRONE AVIONICS & BATTERY
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`font-mono-code text-[11px] px-2 py-0.5 rounded border uppercase font-semibold ${getFlightStateColor(
            flightState
          )}`}
        >
          {flightState}
        </span>
      </div>
    </div>
  );
};

export default AvionicsCardHeader;
