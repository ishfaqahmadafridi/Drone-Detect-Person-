"use client";

import React from "react";
import { SidebarTelemetryWidgetProps } from "@/types";
import { Battery } from "lucide-react";

export const SidebarTelemetryWidget: React.FC<SidebarTelemetryWidgetProps> = ({
  batteryPct,
  isBatteryLow,
  altitude,
  speed,
}) => {
  return (
    <div className="p-3 mx-2.5 mb-2 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col gap-2">
      <div className="flex items-center justify-between text-[11px] font-mono-code">
        <span className="text-slate-400 flex items-center gap-1">
          <Battery
            className={`w-3.5 h-3.5 ${isBatteryLow ? "text-red-400 animate-pulse" : "text-emerald-400"}`}
          />
          6S BATTERY:
        </span>
        <span className={`font-bold ${isBatteryLow ? "text-red-400" : "text-emerald-400"}`}>
          {batteryPct}%
        </span>
      </div>

      {/* Battery level progress meter */}
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isBatteryLow ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-cyan-400"
          }`}
          style={{ width: `${Math.min(100, Math.max(0, batteryPct))}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono-code text-slate-400 pt-1 border-t border-slate-800/60">
        <div>
          ALT: <span className="text-cyan-300 font-bold">{altitude.toFixed(1)}m</span>
        </div>
        <div className="text-right">
          SPD: <span className="text-cyan-300 font-bold">{speed.toFixed(1)}m/s</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarTelemetryWidget;
