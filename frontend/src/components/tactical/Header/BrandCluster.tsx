"use client";

import React from "react";
import { BrandClusterProps } from "@/types";
import { Shield } from "lucide-react";

export const BrandCluster: React.FC<BrandClusterProps> = ({ isConnected }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shrink-0">
        <Shield className="w-4 h-4 text-blue-400" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-base text-slate-100 tracking-tight flex items-center gap-1.5">
            <span>AERO-GUARD</span>
            <span className="text-[11px] font-normal text-slate-400 font-mono-code">/ Operations Console</span>
          </h1>
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isConnected ? "bg-emerald-500" : "bg-amber-500"
            }`}
            title={isConnected ? "Telemetry Feed Online" : "Connecting to telemetry feed..."}
          />
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">Aerial Computer Vision & Perimeter Security Platform</p>
      </div>
    </div>
  );
};

export default BrandCluster;
