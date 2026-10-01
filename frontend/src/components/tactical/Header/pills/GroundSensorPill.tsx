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
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono-code font-medium border bg-slate-800/70 text-slate-300 border-slate-700/60"
      title={`Sensor: ${name} • Mount: ${mountHeight}`}
    >
      <Camera className="w-3 h-3 text-emerald-400" />
      <span>{sensorId} • Fixed</span>
    </div>
  );
};

export default GroundSensorPill;
