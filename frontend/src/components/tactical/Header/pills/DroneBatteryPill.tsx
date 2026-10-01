"use client";

import React from "react";
import { DroneBatteryPillProps } from "@/types";
import { Battery, BatteryWarning } from "lucide-react";

export const DroneBatteryPill: React.FC<DroneBatteryPillProps> = ({
  batteryPct,
  isBatteryLow,
  health,
  voltage,
}) => {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono-code font-medium border ${
        isBatteryLow
          ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
          : "bg-slate-800/70 text-slate-300 border-slate-700/60"
      }`}
      title={`Battery Health: ${health}% • Operating Voltage: ${voltage.toFixed(1)}V`}
    >
      {isBatteryLow ? (
        <BatteryWarning className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <Battery className="w-3.5 h-3.5 text-emerald-400" />
      )}
      <span>{batteryPct}%</span>
    </div>
  );
};

export default DroneBatteryPill;
