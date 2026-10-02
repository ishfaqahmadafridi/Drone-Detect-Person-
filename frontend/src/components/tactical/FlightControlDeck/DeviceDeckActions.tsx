"use client";

import React from "react";
import { DeviceDeckActionsProps } from "@/types";

export const DeviceDeckActions: React.FC<DeviceDeckActionsProps> = ({
  flightState,
  isCommandPending,
  onCommand,
  viewMode = "aerial",
}) => {
  const isGround = viewMode === "ground";

  return (
    <div className="select-none">
      <div className="text-xs font-medium text-slate-300 mb-2.5">
        {isGround ? "Perimeter controls" : "Flight control"}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {isGround ? (
          <>
            <button
              onClick={() => onCommand("preset_gate")}
              disabled={isCommandPending}
              className="py-2 px-3 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 hover:text-white text-xs font-medium text-slate-200 cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lock Gate
            </button>
            <button
              onClick={() => onCommand("preset_patrol")}
              disabled={isCommandPending}
              className="py-2 px-3 rounded-lg border border-blue-500/50 bg-blue-500/15 hover:bg-blue-500/25 hover:border-blue-500/70 text-xs font-medium text-blue-300 hover:text-blue-100 cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Patrol 360
            </button>
            <button
              onClick={() => onCommand("ir_filter")}
              disabled={isCommandPending}
              className="py-2 px-3 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 hover:text-white text-xs font-medium text-slate-200 cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              IR Filter
            </button>
            <button
              onClick={() => onCommand("reboot_sensor")}
              disabled={isCommandPending}
              className="py-2 px-3 rounded-lg border border-red-500/40 bg-red-950/20 hover:bg-red-950/40 hover:border-red-500/60 text-xs font-medium text-red-300 hover:text-red-200 cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset PTZ
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onCommand("takeoff")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                flightState === "AIRBORNE"
                  ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-semibold"
                  : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 hover:text-white text-slate-200"
              }`}
            >
              Takeoff
            </button>
            <button
              onClick={() => onCommand("patrol")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                flightState === "PATROL"
                  ? "border-blue-500/60 bg-blue-500/25 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.2)] font-semibold"
                  : "border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-500/60 text-blue-300 hover:text-blue-100"
              }`}
            >
              Patrol
            </button>
            <button
              onClick={() => onCommand("rtl")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                flightState === "RTL"
                  ? "border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold"
                  : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 hover:text-white text-slate-200"
              }`}
            >
              RTL
            </button>
            <button
              onClick={() => onCommand("land")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                flightState === "LAND"
                  ? "border-red-500/60 bg-red-950/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)] font-semibold"
                  : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-red-500/40 hover:text-white text-slate-200"
              }`}
            >
              Land
            </button>
          </>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mt-2 font-mono-code">
        Flight commands change simulated state only.
      </p>
    </div>
  );
};

export default DeviceDeckActions;
