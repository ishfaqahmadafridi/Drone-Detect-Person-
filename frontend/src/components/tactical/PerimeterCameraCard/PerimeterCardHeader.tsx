"use client";

import React from "react";
import { PerimeterCardHeaderProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Video, ShieldCheck } from "lucide-react";

export const PerimeterCardHeader: React.FC<PerimeterCardHeaderProps> = ({
  cameraId = CCTV_CAMERA_CONFIG.id,
  isOnline = true,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
      <div className="flex items-center gap-2.5">
        <div className="relative p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <Video className="w-4 h-4 text-emerald-300" />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div>
          <h3 className="font-display font-black text-xs tracking-wider text-slate-100 uppercase flex items-center gap-1.5">
            PERIMETER CCTV SENSOR
            <span className="text-[10px] text-emerald-400/80 font-mono-code font-bold">
              ({cameraId})
            </span>
          </h3>
          <p className="text-[10px] font-mono-code text-slate-400 tracking-wider">
            {CCTV_CAMERA_CONFIG.location}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono-code font-bold tracking-wider uppercase border ${
            isOnline
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              : "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
          }`}
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{isOnline ? "FIXED SECURE" : "OFFLINE"}</span>
        </span>
      </div>
    </div>
  );
};

export default PerimeterCardHeader;
