"use client";

import React from "react";
import { PerimeterNightVisionButtonProps } from "@/types";
import { Moon } from "lucide-react";

export const PerimeterNightVisionButton: React.FC<PerimeterNightVisionButtonProps> = ({
  isEnabled,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-mono-code font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] ${
        isEnabled
          ? "bg-purple-950/40 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
          : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
      }`}
      title="Toggle IR Night Vision Sensor Filter"
    >
      <Moon className={`w-3.5 h-3.5 ${isEnabled ? "text-purple-400" : ""}`} />
      <span>IR CUT: {isEnabled ? "AUTO (ON)" : "OFF"}</span>
    </button>
  );
};

export default PerimeterNightVisionButton;
