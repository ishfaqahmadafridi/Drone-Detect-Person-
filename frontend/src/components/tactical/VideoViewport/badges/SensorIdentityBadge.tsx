"use client";

import React from "react";
import { SensorIdentityBadgeProps } from "@/types";
import { useActiveCamera, useSystemClock } from "@/hooks";

export const SensorIdentityBadge: React.FC<SensorIdentityBadgeProps> = ({
  className = "",
}) => {
  const { sensorTag } = useActiveCamera();
  const { utcTime } = useSystemClock();

  return (
    <div
      className={`absolute top-10 left-3.5 z-20 pointer-events-none flex flex-col gap-1 select-none ${className}`}
    >
      <div className="px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-sm border border-slate-700/60 font-mono-code text-[10px] text-slate-200 font-semibold tracking-wider uppercase shadow-md">
        {sensorTag}
      </div>
      <div
        className="px-1 text-[10px] font-mono-code text-slate-400 tracking-wide"
        suppressHydrationWarning
      >
        {utcTime} UTC
      </div>
    </div>
  );
};

export default SensorIdentityBadge;
