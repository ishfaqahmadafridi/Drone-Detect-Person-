"use client";

import React from "react";
import { GroundActiveStreamStateProps } from "@/types";
import { ShieldCheck, ArrowUpRight, RefreshCw, Radio } from "lucide-react";

export const GroundActiveStreamState: React.FC<GroundActiveStreamStateProps> = ({
  onPromote,
  onReconfigure,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] gap-3 text-center">
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400 text-emerald-400">
        <Radio className="w-6 h-6 animate-pulse" />
        <span className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping [animation-duration:3s]" />
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-display font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>PERIMETER STREAM CURRENTLY ACTIVE</span>
        </div>
        <span className="text-[10px] font-mono-code text-slate-300">
          Sensor Feed Online • 1080p FHD @ 25 FPS • Real-time ByteTrack
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full pt-1">
        <button
          type="button"
          onClick={onPromote}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border border-emerald-400 font-display text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>PROMOTE TO HUD</span>
        </button>

        <button
          type="button"
          onClick={onReconfigure}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-slate-900 text-slate-200 border border-slate-700/80 font-display text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RECONFIGURE SENSOR</span>
        </button>
      </div>
    </div>
  );
};

export default GroundActiveStreamState;
