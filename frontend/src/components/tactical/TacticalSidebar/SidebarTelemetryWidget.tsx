"use client";

import React from "react";
import { SidebarTelemetryWidgetProps } from "@/types";
import { Battery, Zap, Camera, ShieldCheck } from "lucide-react";

export const SidebarTelemetryWidget: React.FC<SidebarTelemetryWidgetProps> = ({
  batteryPct,
  isBatteryLow,
  altitude,
  speed,
  viewMode = "aerial",
}) => {
  if (viewMode === "ground") {
    return (
      <div className="p-3 mx-2.5 mb-2 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono-code">
          <span className="text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            PoE POWER:
          </span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            48V <ShieldCheck className="w-3 h-3 text-emerald-400" />
          </span>
        </div>

        {/* Continuous PoE stable power bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
            style={{ width: "100%" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono-code text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1">
            <Camera className="w-2.5 h-2.5 text-cyan-400" />
            <span>MOUNT:</span> <span className="text-cyan-300 font-bold">2.8m</span>
          </div>
          <div className="text-right">
            RES: <span className="text-emerald-300 font-bold">1080p</span>
          </div>
        </div>
      </div>
    );
  }

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
