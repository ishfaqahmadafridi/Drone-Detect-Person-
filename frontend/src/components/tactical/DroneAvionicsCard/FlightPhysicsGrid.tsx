"use client";

import React from "react";
import { FlightPhysicsGridProps } from "@/types";
import { Gauge, Compass, Satellite } from "lucide-react";

export const FlightPhysicsGrid: React.FC<FlightPhysicsGridProps> = ({ altitude, speed, sats }) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="p-2 rounded bg-slate-950/40 border border-slate-800">
        <div className="text-[10px] font-mono-code text-slate-400 flex items-center justify-center gap-1">
          <Gauge className="w-3 h-3 text-cyan-400" />
          <span>ALTITUDE</span>
        </div>
        <div className="font-display font-bold text-sm text-cyan-300 mt-0.5">
          {altitude.toFixed(1)}m
        </div>
      </div>

      <div className="p-2 rounded bg-slate-950/40 border border-slate-800">
        <div className="text-[10px] font-mono-code text-slate-400 flex items-center justify-center gap-1">
          <Compass className="w-3 h-3 text-emerald-400" />
          <span>SPEED</span>
        </div>
        <div className="font-display font-bold text-sm text-emerald-300 mt-0.5">
          {speed.toFixed(1)} m/s
        </div>
      </div>

      <div className="p-2 rounded bg-slate-950/40 border border-slate-800">
        <div className="text-[10px] font-mono-code text-slate-400 flex items-center justify-center gap-1">
          <Satellite className="w-3 h-3 text-amber-400" />
          <span>GPS SATS</span>
        </div>
        <div className="font-display font-bold text-sm text-amber-300 mt-0.5">
          {sats} (3D FIX)
        </div>
      </div>
    </div>
  );
};

export default FlightPhysicsGrid;
