"use client";

import React from "react";
import { PerimeterOpticsGridProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Eye, ShieldAlert, Sliders } from "lucide-react";

export const PerimeterOpticsGrid: React.FC<PerimeterOpticsGridProps> = ({
  mountHeight = CCTV_CAMERA_CONFIG.mountHeight,
  lens = CCTV_CAMERA_CONFIG.lens,
  tamperStatus = CCTV_CAMERA_CONFIG.tamperStatus,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {/* 1. Fixed Mount Height */}
      <div className="flex flex-col p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
        <span className="text-[10px] font-mono-code text-slate-400 flex items-center justify-center gap-1 uppercase">
          <Sliders className="w-3 h-3 text-cyan-400" />
          Mount Height
        </span>
        <span className="text-sm font-mono-code font-bold text-cyan-300 mt-1 truncate">
          {mountHeight}
        </span>
      </div>

      {/* 2. Optical Field of View */}
      <div className="flex flex-col p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
        <span className="text-[10px] font-mono-code text-slate-400 flex items-center justify-center gap-1 uppercase">
          <Eye className="w-3 h-3 text-emerald-400" />
          Optical Lens
        </span>
        <span className="text-sm font-mono-code font-bold text-emerald-300 mt-1 truncate">
          {lens}
        </span>
      </div>

      {/* 3. Anti-Tamper Sensor */}
      <div className="flex flex-col p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
        <span className="text-[10px] font-mono-code text-slate-400 flex items-center justify-center gap-1 uppercase">
          <ShieldAlert className="w-3 h-3 text-amber-400" />
          Anti-Tamper
        </span>
        <span className="text-sm font-mono-code font-bold text-emerald-400 mt-1 truncate">
          {tamperStatus.split(" ")[0]}
        </span>
      </div>
    </div>
  );
};

export default PerimeterOpticsGrid;
