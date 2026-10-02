"use client";

import React from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { MobileGroundCardHeaderProps } from "@/types";

export const MobileGroundCardHeader: React.FC<MobileGroundCardHeaderProps> = ({
  isActive,
}) => {
  return (
    <div className="p-3 bg-[#06080E]/80 border-b border-slate-700/60 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Camera className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
          CH-02: GROUND CCTV & MOBILE SENSORS
        </span>
      </div>
      <div>
        {isActive && (
          <span className="font-mono-code text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ACTIVE VIEWPORT
          </span>
        )}
      </div>
    </div>
  );
};
