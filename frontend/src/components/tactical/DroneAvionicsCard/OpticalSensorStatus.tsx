"use client";

import React from "react";
import { OpticalSensorStatusProps } from "@/types";
import { Video } from "lucide-react";

export const OpticalSensorStatus: React.FC<OpticalSensorStatusProps> = ({
  camOnline,
  camDetecting,
}) => {
  return (
    <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <Video className={`w-4 h-4 ${camOnline ? "text-cyan-400" : "text-red-400"}`} />
        <span className="font-mono-code text-[11px] text-slate-300">
          OPTICAL SENSOR: <strong className="text-white">{camOnline ? "ONLINE (1080p)" : "DISCONNECTED"}</strong>
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            camDetecting ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
          }`}
        />
        <span className="font-mono-code text-[10px] text-emerald-400">
          {camDetecting ? "PERSON DETECT: ACTIVE" : "STANDBY"}
        </span>
      </div>
    </div>
  );
};

export default OpticalSensorStatus;
