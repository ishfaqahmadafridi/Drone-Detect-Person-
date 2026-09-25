"use client";

import React from "react";
import { BrandClusterProps } from "@/types";
import { Radio } from "lucide-react";

export const BrandCluster: React.FC<BrandClusterProps> = ({ isConnected }) => {
  return (
    <div className="flex items-center gap-3.5">
      <div className="relative w-9 h-9 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(0,242,254,0.4)]">
        <div className="absolute inset-0 rounded-full border border-cyan-400 animate-radar" />
        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display font-bold text-xl tracking-wider text-white">
            AERO<span className="text-cyan-400">GUARD</span>
          </h1>
          <span className="font-mono-code text-[10px] bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 px-1.5 py-0.5 rounded">
            ENTERPRISE HUD
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : "bg-red-500 animate-ping"
            }`}
            title={isConnected ? "WebSocket Connected" : "Connecting to telemetry feed..."}
          />
        </div>
        <p className="text-xs text-slate-400">Drone Aerial Vision • Multi-Person Gathering & Intrusion Monitor</p>
      </div>
    </div>
  );
};
