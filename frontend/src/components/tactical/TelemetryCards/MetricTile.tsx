import React from "react";
import { cn } from "@/lib/utils";
import { MetricTileProps } from "@/types";

export const MetricTile: React.FC<MetricTileProps> = ({
  title,
  icon,
  value,
  subValue,
  progressPercent,
  progressBarColor = "bg-cyan-400",
  isAlertActive = false,
  alertBorderColor = "border-red-500/60 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  className,
}) => {
  return (
    <div
      className={cn(
        "glass-panel p-3.5 rounded-lg flex flex-col gap-1.5 transition-all duration-300",
        isAlertActive ? alertBorderColor : "border-slate-800 hover:border-cyan-500/40",
        className
      )}
    >
      <div className="flex items-center justify-between text-slate-400">
        <span className="font-mono-code text-[11px] uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-slate-400">{subValue}</span>
      </div>
      <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden mt-1">
        <div
          className={cn("h-full transition-all duration-300", progressBarColor)}
          style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};
