"use client";

import React from "react";
import { Sliders, CheckCircle2 } from "lucide-react";
import { TuningHeaderProps } from "@/types";

export const TuningHeader: React.FC<TuningHeaderProps> = ({ showSavedToast }) => {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-cyan-400" />
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
          SURVEILLANCE PARAMETERS
        </h3>
      </div>
      {showSavedToast && (
        <span className="flex items-center gap-1 text-[11px] font-mono-code text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Updated
        </span>
      )}
    </div>
  );
};
