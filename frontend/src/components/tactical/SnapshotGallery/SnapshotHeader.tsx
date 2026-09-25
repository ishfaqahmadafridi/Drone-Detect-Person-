"use client";

import React from "react";
import { Image as ImageIcon, RotateCw } from "lucide-react";
import { SnapshotHeaderProps } from "@/types";

export const SnapshotHeader: React.FC<SnapshotHeaderProps> = ({ count, isLoading, onRefresh }) => {
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
      <button
        onClick={onRefresh}
        className="flex items-center gap-1 text-[11px] font-mono-code text-cyan-400 hover:underline transition-all"
        title="Refresh captured frames"
      >
        <RotateCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} /> Refresh
      </button>
    </div>
  );
};
