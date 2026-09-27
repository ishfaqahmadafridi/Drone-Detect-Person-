"use client";

import React from "react";
import { ZoneBannerProps } from "@/types";
import { Check, RotateCcw, X } from "lucide-react";

export const ZoneBanner: React.FC<ZoneBannerProps> = ({ onSave, onReset, onCancel }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md border border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.4)] px-4 py-2 rounded-lg flex items-center gap-3 pointer-events-auto z-30">
      <span className="text-xs text-white">
        🎯 <strong>ZONE EDITOR:</strong> Drag points or click to place vertices.
      </span>
      <div className="flex gap-1.5">
        <button
          onClick={onSave}
          className="flex items-center gap-1 bg-cyan-400 text-black px-2.5 py-1 rounded text-xs font-bold hover:bg-cyan-300 transition-colors"
        >
          <Check className="w-3 h-3" /> Save
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1 bg-slate-800 text-slate-200 px-2.5 py-1 rounded text-xs hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <button
          onClick={onCancel}
          className="p-1 text-slate-400 hover:text-white"
          aria-label="Cancel editing"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
