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
              className="py-2 px-3 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
            >
              Lock Gate
            </button>
            <button
              onClick={() => onCommand("preset_patrol")}
              className="py-2 px-3 rounded-lg border border-blue-500/40 bg-blue-500/10 text-xs font-medium text-blue-300 transition-colors"
            >
              Patrol 360
            </button>
            <button
              onClick={() => onCommand("ir_filter")}
              className="py-2 px-3 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
            >
              IR Filter
            </button>
            <button
              onClick={() => onCommand("reboot_sensor")}
              className="py-2 px-3 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-xs font-medium text-red-300 transition-colors"
            >
              Reset PTZ
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onCommand("takeoff")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                flightState === "AIRBORNE"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
              }`}
            >
              Takeoff
            </button>
            <button
              onClick={() => onCommand("patrol")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                flightState === "PATROL"
                  ? "border-blue-500/50 bg-blue-500/20 text-blue-200"
                  : "border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
              }`}
            >
              Patrol
            </button>
            <button
              onClick={() => onCommand("rtl")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                flightState === "RTL"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
              }`}
            >
              RTL
            </button>
            <button
              onClick={() => onCommand("land")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                flightState === "LAND"
                  ? "border-red-500/50 bg-red-950/30 text-red-300"
                  : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:border-red-500/30"
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
