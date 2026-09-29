"use client";

import React from "react";
import { Film } from "lucide-react";
import { EmptyPreviewStateProps } from "@/types";

export const EmptyPreviewState: React.FC<EmptyPreviewStateProps> = ({ className = "" }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
        <Film className="w-8 h-8 text-purple-400/80" />
      </div>
      <h3 className="font-display text-base font-bold text-slate-200 tracking-wider uppercase mb-1">
        No Recording Selected
      </h3>
      <p className="text-xs font-mono-code text-slate-500 max-w-sm">
        Select an aerial or ground evidence record from the list on the left to inspect high-resolution frame data and threat telemetry.
      </p>
    </div>
  );
};

export default EmptyPreviewState;
