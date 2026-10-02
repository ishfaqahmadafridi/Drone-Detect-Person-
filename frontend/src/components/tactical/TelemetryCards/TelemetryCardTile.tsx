"use client";

import React from "react";
import { TelemetryCardTileProps } from "@/types";
import { ArrowUpRight } from "lucide-react";

export const TelemetryCardTile: React.FC<TelemetryCardTileProps> = ({
  title,
  value,
  subText,
  isAlert = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel p-4 rounded-xl border flex flex-col justify-between gap-3 select-none transition-all ${
        isAlert
          ? "border-red-500/50 bg-red-950/20 shadow-sm"
          : "border-slate-800 hover:border-slate-700 bg-slate-900/60"
      } ${onClick ? "cursor-pointer group" : ""}`}
    >
      <div>
        <div className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
          {title}
        </div>
        <div className="text-2xl font-mono-code font-bold text-slate-100 mt-1">
          {value}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 group-hover:text-slate-300">
        <span>{subText}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
      </div>
    </div>
  );
};

export default TelemetryCardTile;
