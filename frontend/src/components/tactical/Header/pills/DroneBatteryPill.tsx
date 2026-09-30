"use client";

import React from "react";
import { DroneBatteryPillProps } from "@/types";
import { Battery } from "lucide-react";

export const DroneBatteryPill: React.FC<DroneBatteryPillProps> = ({
  batteryPct,
  isBatteryLow,
  health,
  voltage,
}) => {
  return (
    <div
      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono-code font-bold tracking-wider border ${
        isBatteryLow
          ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
          : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
      }`}
      title={`Health: ${health}% | Voltage: ${voltage.toFixed(1)}V`}
    >
      <Battery className="w-3.5 h-3.5" />
      <span>{batteryPct}%</span>
    </div>
  );
};

export default DroneBatteryPill;
