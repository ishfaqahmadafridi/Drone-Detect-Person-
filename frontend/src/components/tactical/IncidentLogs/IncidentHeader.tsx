"use client";

import React from "react";
import { AlertCircle, Download, RefreshCw } from "lucide-react";
import { IncidentHeaderProps } from "@/types";

export const IncidentHeader: React.FC<IncidentHeaderProps> = ({
  count,
  isLoading,
  onRefresh,
  onExport,
}) => {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-cyan-400" />
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
          INCIDENT AUDIT LOG
        </h3>
        <span className="font-mono-code text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
          {count} Events
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="text-slate-400 hover:text-cyan-400 p-1 rounded transition-colors"
          title="Refresh incident logs"
          aria-label="Refresh incident logs"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1 text-[11px] font-mono-code text-cyan-400 hover:underline"
          title="Export incident report as CSV"
        >
          <Download className="w-3 h-3" /> Export CSV
        </button>
      </div>
    </div>
  );
};
