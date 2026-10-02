"use client";

import React from "react";
import { StreamFilterControlsProps } from "@/types";
import { Moon } from "lucide-react";

export const StreamFilterControls: React.FC<StreamFilterControlsProps> = ({
  isNightVision,
  onToggleNightVision,
}) => {
  return (
    <button
      onClick={onToggleNightVision}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] select-none ${
        isNightVision
          ? "bg-emerald-950/50 text-emerald-300 border-emerald-500/50 shadow-sm font-semibold"
          : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border-slate-800 hover:border-slate-700 hover:text-white"
      }`}
      title="Toggle Night Vision / Infrared Sensor Filter"
    >
      <Moon className={`w-3.5 h-3.5 ${isNightVision ? "text-emerald-400" : "text-slate-400"}`} />
      <span>IR: {isNightVision ? "On" : "Off"}</span>
    </button>
  );
};

export default StreamFilterControls;
