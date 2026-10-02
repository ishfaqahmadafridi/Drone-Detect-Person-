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
      className={`glass-panel p-4 rounded-xl border flex flex-col justify-between gap-3 select-none transition-all duration-200 group cursor-pointer active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${
        isAlert
          ? "border-red-500/50 bg-red-950/20 hover:border-red-400 hover:bg-red-950/40 shadow-sm"
          : "border-slate-800 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-800/70"
      }`}
    >
      <div>
        <div className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
          {title}
        </div>
        <div className="text-2xl font-mono-code font-bold text-slate-100 group-hover:text-white mt-1 transition-colors">
          {value}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 group-hover:text-slate-300">
        <span>{subText}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </div>
  );
};

export default TelemetryCardTile;
