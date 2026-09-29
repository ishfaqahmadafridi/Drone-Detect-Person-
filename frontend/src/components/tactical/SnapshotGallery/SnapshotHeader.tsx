"use client";

import React from "react";
import { Image as ImageIcon, RotateCw } from "lucide-react";
import { SnapshotHeaderProps } from "@/types";

export const SnapshotHeader: React.FC<SnapshotHeaderProps> = ({
  count,
  isLoading,
  onRefresh,
  filterMode = "all",
  onFilterChange,
}) => {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-cyan-400" />
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
          EVIDENTIARY SNAPSHOTS & INCIDENT FRAMES
        </h3>
        <span className="font-mono-code text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
          {count} Captures
        </span>
      </div>

      <div className="flex items-center gap-3">
        {onFilterChange && (
          <div className="flex rounded-md overflow-hidden border border-slate-800 text-[10px] font-mono-code">
            <button
              onClick={() => onFilterChange("all")}
              className={`px-2 py-0.5 uppercase transition-colors ${
                filterMode === "all"
                  ? "bg-slate-700 text-white font-bold"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => onFilterChange("aerial")}
              className={`px-2 py-0.5 uppercase border-l border-slate-800 transition-colors ${
                filterMode === "aerial"
                  ? "bg-emerald-500/20 text-emerald-300 font-bold border-emerald-500/40"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              AERIAL
            </button>
            <button
              onClick={() => onFilterChange("ground")}
              className={`px-2 py-0.5 uppercase border-l border-slate-800 transition-colors ${
                filterMode === "ground"
                  ? "bg-blue-500/20 text-blue-300 font-bold border-blue-500/40"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              GROUND
            </button>
          </div>
        )}

        <button
          onClick={onRefresh}
          className="flex items-center gap-1 text-[11px] font-mono-code text-cyan-400 hover:underline transition-all"
          title="Refresh captured frames"
        >
          <RotateCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
    </div>
  );
};
