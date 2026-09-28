"use client";

import React from "react";
import { Radio } from "lucide-react";
import { ViewportStandbyLoaderProps } from "@/types";

export const ViewportStandbyLoader: React.FC<ViewportStandbyLoaderProps> = ({ isLoaded }) => {
  if (isLoaded) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#030712] z-0">
      <div className="relative w-16 h-16 rounded-full border border-cyan-500/40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-25" />
        <div className="w-10 h-10 rounded-full border border-dashed border-cyan-400/60 animate-spin" />
        <Radio className="absolute w-5 h-5 text-cyan-400 animate-pulse" />
      </div>
      <div className="text-center font-mono-code">
        <div className="text-xs text-cyan-400 tracking-widest uppercase font-semibold">
          OPTICAL SENSOR ACTIVE
        </div>
        <div className="text-[10px] text-slate-400 mt-1">
          Synchronizing High-Speed MJPEG Telemetry...
        </div>
      </div>
    </div>
  );
};
