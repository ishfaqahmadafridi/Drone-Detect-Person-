"use client";

import React from "react";
import { ThermalFeedCardProps } from "@/types";

export const ThermalFeedCard: React.FC<ThermalFeedCardProps> = ({ onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="group relative rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all duration-300"
    >
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-display font-bold text-xs text-white uppercase">
            CH-03: FLIR THERMAL / INFRARED SENSOR
          </span>
        </div>
        <span className="font-mono-code text-[10px] text-amber-400">HEAT SIGNATURES</span>
      </div>
      <div className="relative aspect-video bg-gradient-to-br from-purple-950 via-slate-950 to-amber-950/40 flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 rounded-full border border-amber-500/40 flex items-center justify-center mb-2">
          <div className="w-6 h-6 rounded-full bg-amber-400/30 animate-ping" />
        </div>
        <span className="font-display font-semibold text-xs text-amber-300">
          Long-Wave IR Spectrum (8–14 µm)
        </span>
        <span className="font-mono-code text-[10px] text-slate-400 mt-1">
          Differential human body thermal detection & night vision lock
        </span>
      </div>
    </div>
  );
};

export default ThermalFeedCard;
