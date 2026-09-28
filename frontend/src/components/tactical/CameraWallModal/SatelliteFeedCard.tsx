"use client";

import React from "react";
import { SatelliteFeedCardProps } from "@/types";
import { Globe } from "lucide-react";

export const SatelliteFeedCard: React.FC<SatelliteFeedCardProps> = ({ onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="group relative rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-all duration-300"
    >
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-display font-bold text-xs text-white uppercase">
            CH-04: SATELLITE PERIMETER RADAR
          </span>
        </div>
        <span className="font-mono-code text-[10px] text-cyan-400">ORBITAL UPLINK</span>
      </div>
      <div className="relative aspect-video bg-[#030612] flex flex-col items-center justify-center text-center p-4">
        <Globe className="w-10 h-10 text-cyan-400/50 mb-2 group-hover:rotate-45 transition-transform duration-700" />
        <span className="font-display font-semibold text-xs text-cyan-300">
          Low Earth Orbit Wide Surveillance
        </span>
        <span className="font-mono-code text-[10px] text-slate-400 mt-1">
          Geo-spatial perimeter fence radar & exclusion polygon sync
        </span>
      </div>
    </div>
  );
};

export default SatelliteFeedCard;
