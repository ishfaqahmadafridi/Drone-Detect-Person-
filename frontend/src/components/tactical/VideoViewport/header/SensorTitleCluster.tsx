"use client";

import React from "react";
import { SensorTitleClusterProps } from "@/types";
import { useActiveCamera } from "@/hooks";
import { MapPin } from "lucide-react";

export const SensorTitleCluster: React.FC<SensorTitleClusterProps> = ({ className = "" }) => {
  const { camId, camName, camLoc } = useActiveCamera();

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
      <div className="flex items-center gap-2">
        <h2 className="font-display font-bold text-xs tracking-wider text-white uppercase">
          {camId}: {camName}
        </h2>
        <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono-code text-slate-300 px-2 py-0.5 rounded bg-[#06080E] border border-slate-700/80">
          <MapPin className="w-3 h-3 text-blue-400" />
          <span>{camLoc}</span>
        </span>
      </div>
    </div>
  );
};
