"use client";

import React from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { MobileGroundCardHeaderProps } from "@/types";

export const MobileGroundCardHeader: React.FC<MobileGroundCardHeaderProps> = ({ isActive }) => {
  return (
    <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Camera className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-display font-bold text-xs text-white uppercase">
          CH-02: MOBILE PHONE / GROUND WEBCAM
        </span>
      </div>
      {isActive ? (
        <span className="font-mono-code text-[10px] text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> ACTIVE VIEWPORT
        </span>
      ) : (
        <span className="font-mono-code text-[10px] text-slate-400">READY TO CONNECT</span>
      )}
    </div>
  );
};
