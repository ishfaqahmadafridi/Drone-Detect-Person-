"use client";

import React from "react";
import { PerimeterActionButtonsProps } from "@/types";
import { RefreshCw, LayoutGrid } from "lucide-react";

export const PerimeterActionButtons: React.FC<PerimeterActionButtonsProps> = ({
  onOpenWall,
  onReconnectStream,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 pt-1">
      {/* 1. Reconnect Camera Feed Button */}
      <button
        type="button"
        onClick={() => onReconnectStream?.()}
        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono-code font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] active:scale-[0.98]"
        title="Reconnect or reset CCTV feed connection"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>RECONNECT FEED</span>
      </button>

      {/* 2. Open Camera Wall Button */}
      <button
        type="button"
        onClick={() => onOpenWall?.()}
        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono-code font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] active:scale-[0.98]"
        title="Open Full Camera Wall Matrix"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>CAMERA WALL</span>
      </button>
    </div>
  );
};

export default PerimeterActionButtons;
