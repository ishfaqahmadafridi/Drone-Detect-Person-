"use client";

import React from "react";
import { PerimeterTelemetryBarProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Camera, MapPin, Radio, Shield } from "lucide-react";

export const PerimeterTelemetryBar: React.FC<PerimeterTelemetryBarProps> = ({
  cameraId = CCTV_CAMERA_CONFIG.id,
  mountHeight = CCTV_CAMERA_CONFIG.mountHeight,
  resolution = CCTV_CAMERA_CONFIG.resolution,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono-code">
      {/* 1. Camera Sensor ID */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
        <Camera className="w-3.5 h-3.5 text-cyan-400" />
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">Sensor ID</span>
          <span className="font-bold text-slate-200">{cameraId}</span>
        </div>
      </div>

      {/* 2. Fixed Mount Elevation */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">Mount Height</span>
          <span className="font-bold text-emerald-300">{mountHeight.split(" ")[0]}</span>
        </div>
      </div>

      {/* 3. Optical Stream Resolution */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
        <Radio className="w-3.5 h-3.5 text-cyan-400" />
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">Resolution</span>
          <span className="font-bold text-cyan-300">{resolution.split(" ")[0]}</span>
        </div>
      </div>

      {/* 4. Security State */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">Tamper Status</span>
          <span className="font-bold text-emerald-400">SECURE</span>
        </div>
      </div>
    </div>
  );
};

export default PerimeterTelemetryBar;
