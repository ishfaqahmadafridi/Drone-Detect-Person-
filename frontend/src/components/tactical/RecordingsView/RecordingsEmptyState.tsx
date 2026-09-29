"use client";

import React from "react";
import { Film, RefreshCw } from "lucide-react";
import { RecordingsEmptyStateProps } from "@/types";

export const RecordingsEmptyState: React.FC<RecordingsEmptyStateProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
        <span className="text-xs font-mono-code">LOADING RECORDS…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-600 border border-dashed border-slate-800 rounded-xl">
      <Film className="w-8 h-8 text-slate-700" />
      <div className="text-center">
        <p className="text-xs font-mono-code text-slate-500">NO EVIDENCE RECORDS</p>
        <p className="text-[10px] text-slate-600 mt-1">
          Frames are captured automatically when a threat is detected
        </p>
      </div>
    </div>
  );
};

export default RecordingsEmptyState;
