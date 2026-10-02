"use client";

import React from "react";
import { GroundActiveStreamStateProps } from "@/types";
import { ShieldCheck, Eye, Settings } from "lucide-react";

export const GroundActiveStreamState: React.FC<GroundActiveStreamStateProps> = ({
  onPromote,
  onReconfigure,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center py-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
        <ShieldCheck className="w-8 h-8" />
      </div>

      <div>
        <h4 className="font-display font-black text-sm text-emerald-300 uppercase tracking-wide">
          GROUND SENSOR ENGAGED
        </h4>
        <p className="font-mono-code text-[11px] text-slate-400 mt-1 max-w-xs">
          Live stream is active. Select Viewport to promote this camera to main tactical view.
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          type="button"
          onClick={onPromote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>VIEWPORT</span>
        </button>

        <button
          type="button"
          onClick={onReconfigure}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-display font-bold text-xs uppercase tracking-wider transition-colors border border-slate-700"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>RECONFIGURE</span>
        </button>
      </div>
    </div>
  );
};

export default GroundActiveStreamState;
