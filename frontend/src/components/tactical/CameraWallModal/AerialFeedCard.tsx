"use client";

import React from "react";
import { AerialFeedCardProps } from "@/types";
import { CheckCircle2 } from "lucide-react";
import { getVideoStreamUrl } from "@/constants/network";

export const AerialFeedCard: React.FC<AerialFeedCardProps> = ({ isActive, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 ${
        isActive
          ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
          : "border-slate-800 bg-slate-950/40 hover:border-cyan-500/50"
      }`}
    >
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-display font-bold text-xs text-white uppercase">
            CH-01: AERIAL DRONE GIMBAL
          </span>
        </div>
        {isActive && (
          <span className="font-mono-code text-[10px] text-cyan-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> ACTIVE VIEWPORT
          </span>
        )}
      </div>

      <div className="relative aspect-video bg-black/90 flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getVideoStreamUrl()}
          alt="Aerial Drone Feed"
          className="w-full h-full object-contain pointer-events-none"
        />
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-slate-700 font-mono-code text-[10px] text-slate-300">
          AI DETECT: ACTIVE • 1080p @ 25FPS
        </div>
      </div>
    </div>
  );
};

export default AerialFeedCard;
