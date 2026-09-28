"use client";

import React from "react";
import { BatteryHealthGaugeProps } from "@/types";
import { Battery, BatteryCharging } from "lucide-react";
import { getBatteryColor } from "@/utils";

export const BatteryHealthGauge: React.FC<BatteryHealthGaugeProps> = ({
  battery,
  voltage,
  health,
  flightTime,
}) => {
  return (
    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border flex items-center justify-center ${getBatteryColor(battery)}`}>
          {battery > 20 ? <BatteryCharging className="w-5 h-5" /> : <Battery className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-white">{battery}%</span>
            <span className="font-mono-code text-xs text-slate-400">({voltage}V 6S)</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono-code flex items-center gap-1.5">
            <span>
              Health: <strong className="text-emerald-400">{health}%</strong>
            </span>
            <span>•</span>
            <span>
              Flight Rem: <strong className="text-cyan-400">{flightTime}m</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Charge Bar */}
      <div className="w-24 flex flex-col gap-1">
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              battery > 50 ? "bg-emerald-400" : battery > 20 ? "bg-amber-400" : "bg-red-400"
            }`}
            style={{ width: `${battery}%` }}
          />
        </div>
        <span className="text-[9px] font-mono-code text-slate-500 text-right">3.73V / CELL</span>
      </div>
    </div>
  );
};

export default BatteryHealthGauge;
