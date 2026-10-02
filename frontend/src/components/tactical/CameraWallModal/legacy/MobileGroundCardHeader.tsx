"use client";

import React from "react";
import { MobileGroundCardHeaderProps } from "@/types";
import { Smartphone } from "lucide-react";

export const MobileGroundCardHeader: React.FC<MobileGroundCardHeaderProps> = ({ isActive }) => {
  return (
    <div className="p-3 bg-[#06080E]/80 border-b border-slate-700/60 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Smartphone className="w-4 h-4 text-emerald-400" />
        <span className="font-display font-bold text-xs text-white uppercase">
          CH-02: GROUND CAMERA / PHONE SENSOR
        </span>
      </div>
      {isActive && (
        <span className="font-mono-code text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          ACTIVE SENSOR
        </span>
      )}
    </div>
  );
};

export default MobileGroundCardHeader;
