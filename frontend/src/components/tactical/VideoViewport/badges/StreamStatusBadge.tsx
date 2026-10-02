"use client";

import React from "react";
import { StreamStatusBadgeProps } from "@/types";
import { useActiveCamera } from "@/hooks";

export const StreamStatusBadge: React.FC<StreamStatusBadgeProps> = ({
  className = "",
}) => {
  const { isSimulation } = useActiveCamera();

  return (
    <div
      className={`absolute top-10 right-3.5 z-20 pointer-events-none select-none ${className}`}
    >
      <div className="px-2.5 py-0.5 rounded bg-slate-950/85 backdrop-blur-sm border border-slate-700/60 font-mono-code text-[10px] text-slate-200 font-medium flex items-center gap-1.5 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{isSimulation ? "SIMULATED • ONLINE" : "LIVE LINK • ONLINE"}</span>
      </div>
    </div>
  );
};

export default StreamStatusBadge;
