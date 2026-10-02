"use client";

import React, { useState, useEffect } from "react";
import { SidebarSystemHealthProps } from "@/types";
import { useTelemetryMetrics } from "@/hooks";

export const SidebarSystemHealth: React.FC<SidebarSystemHealthProps> = ({
  telemetryHz = 10,
  inferenceFps,
  lastSync,
  isCollapsed = false,
}) => {
  const { fps } = useTelemetryMetrics();
  const [timeStr, setTimeStr] = useState<string>("15:24:06");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        [
          String(now.getUTCHours()).padStart(2, "0"),
          String(now.getUTCMinutes()).padStart(2, "0"),
          String(now.getUTCSeconds()).padStart(2, "0"),
        ].join(":")
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isCollapsed) {
    return (
      <div className="p-2 border-t border-slate-800/80 flex flex-col items-center gap-1 text-[9px] font-mono-code text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>10Hz</span>
      </div>
    );
  }

  const displayFps = (inferenceFps ?? (fps > 0 ? fps : 29.8)).toFixed(1);
  const displaySync = lastSync || timeStr;

  return (
    <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 select-none">
      <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400 font-semibold mb-2.5">
        SYSTEM HEALTH
      </div>

      <div className="flex flex-col gap-2 font-mono-code text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Telemetry</span>
          <span className="text-slate-200">{telemetryHz} Hz</span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>Inference</span>
          <span className="text-slate-200">{displayFps} FPS</span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>Last sync</span>
          <span className="text-slate-200">{displaySync}</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarSystemHealth;
