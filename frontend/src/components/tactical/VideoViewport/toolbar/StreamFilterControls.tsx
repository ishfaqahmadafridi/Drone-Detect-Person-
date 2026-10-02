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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors select-none ${
        isNightVision
          ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/50 shadow-sm"
          : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border-slate-800 hover:text-white"
      }`}
      title="Toggle Night Vision / Infrared Sensor Filter"
    >
      <Moon className="w-3.5 h-3.5 text-slate-400" />
      <span>IR: {isNightVision ? "On" : "Off"}</span>
    </button>
  );
};

export default StreamFilterControls;
