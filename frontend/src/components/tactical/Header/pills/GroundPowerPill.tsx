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
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono-code font-bold tracking-wider border bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
      title={`Power: ${powerSource} | Status: ${powerStatus}`}
    >
      <Zap className="w-3.5 h-3.5 text-cyan-400" />
      <span>PoE 48V (MAINS)</span>
    </div>
  );
};

export default GroundPowerPill;
