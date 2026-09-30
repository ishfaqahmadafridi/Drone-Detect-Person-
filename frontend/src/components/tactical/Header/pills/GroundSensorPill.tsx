"use client";

import React from "react";
import { GroundSensorPillProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Camera } from "lucide-react";

export const GroundSensorPill: React.FC<GroundSensorPillProps> = ({
  sensorId = CCTV_CAMERA_CONFIG.id,
  name = CCTV_CAMERA_CONFIG.name,
  mountHeight = CCTV_CAMERA_CONFIG.mountHeight,
}) => {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono-code font-bold tracking-wider uppercase border bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
      title={`Sensor: ${name} | Mount: ${mountHeight}`}
    >
      <Camera className="w-3 h-3 text-emerald-400" />
      <span>{sensorId} FIXED</span>
    </div>
  );
};

export default GroundSensorPill;
