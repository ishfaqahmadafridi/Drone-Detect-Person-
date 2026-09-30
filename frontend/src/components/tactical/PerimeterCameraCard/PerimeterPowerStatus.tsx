"use client";

import React from "react";
import { PerimeterPowerStatusProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Zap, CheckCircle2 } from "lucide-react";

export const PerimeterPowerStatus: React.FC<PerimeterPowerStatusProps> = ({
  powerSource = CCTV_CAMERA_CONFIG.powerSource,
  powerStatus = CCTV_CAMERA_CONFIG.powerStatus,
  voltage = CCTV_CAMERA_CONFIG.voltage,
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono-code font-bold text-lg text-emerald-400">
                PoE 48V
              </span>
              <span className="text-[11px] font-mono-code text-slate-400">
                ({voltage})
              </span>
            </div>
            <div className="text-[10px] font-mono-code text-slate-400 flex items-center gap-1">
              <span>Supply:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> MAINS 24/7
              </span>
              <span className="text-slate-600">•</span>
              <span>Load:</span>
              <span className="text-cyan-300">12.4W</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: "100%" }}
            />
          </div>
          <span className="text-[9px] font-mono-code text-emerald-400/80">
            {powerStatus}
          </span>
        </div>
      </div>
      <div className="text-[10px] font-mono-code text-slate-500 pt-1 border-t border-slate-800/50">
        Infrastructure: {powerSource}
      </div>
    </div>
  );
};

export default PerimeterPowerStatus;
