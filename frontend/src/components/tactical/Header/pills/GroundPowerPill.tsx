"use client";

import React from "react";
import { GroundPowerPillProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Zap } from "lucide-react";

export const GroundPowerPill: React.FC<GroundPowerPillProps> = ({
  powerSource = CCTV_CAMERA_CONFIG.powerSource,
  powerStatus = CCTV_CAMERA_CONFIG.powerStatus,
}) => {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono-code font-medium border bg-slate-800/70 text-slate-300 border-slate-700/60"
      title={`Power: ${powerSource} • Status: ${powerStatus}`}
    >
      <Zap className="w-3.5 h-3.5 text-blue-400" />
      <span>PoE 48V (Online)</span>
    </div>
  );
};

export default GroundPowerPill;
