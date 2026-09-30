"use client";

import React from "react";
import { PerimeterNetworkStatusProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Network, Activity } from "lucide-react";

export const PerimeterNetworkStatus: React.FC<PerimeterNetworkStatusProps> = ({
  networkProtocol = CCTV_CAMERA_CONFIG.networkProtocol,
  resolution = CCTV_CAMERA_CONFIG.resolution,
  isDetecting = true,
}) => {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono-code">
      <div
        className="flex items-center gap-2"
        title={`Protocol: ${networkProtocol}`}
      >
        <Network className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-slate-400">STREAM LINK:</span>
        <span className="font-bold text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE ({resolution.split(" ")[0]})
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-slate-400">CV AI:</span>
        <span
          className={`font-bold ${
            isDetecting ? "text-emerald-400" : "text-slate-500"
          }`}
        >
          {isDetecting ? "ACTIVE" : "STANDBY"}
        </span>
      </div>
    </div>
  );
};

export default PerimeterNetworkStatus;
