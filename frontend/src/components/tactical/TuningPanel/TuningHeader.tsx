"use client";

import React from "react";
import { Sliders, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { TuningHeaderProps } from "@/types";

export const TuningHeader: React.FC<TuningHeaderProps> = ({
  showSavedToast,
  isOpen = true,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between group cursor-pointer focus:outline-none"
    >
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white group-hover:text-blue-300 transition-colors">
          SURVEILLANCE PARAMETERS
        </h3>
      </div>
      <div className="flex items-center gap-2">
        {showSavedToast && (
          <span className="flex items-center gap-1 text-[11px] font-mono-code text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" /> Updated
          </span>
        )}
        <span className="text-[10px] font-mono-code text-slate-400 group-hover:text-blue-400 flex items-center gap-1 transition-colors">
          {isOpen ? (
            <>
              <span>COLLAPSE</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span className="text-blue-400 font-semibold">&gt; CLICK TO OPEN</span>
              <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
            </>
          )}
        </span>
      </div>
    </button>
  );
};
