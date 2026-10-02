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
        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 font-mono-code font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)] active:scale-[0.98] cursor-pointer"
        title="Reconnect or reset CCTV feed connection"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>RECONNECT FEED</span>
      </button>

      {/* 2. Open Camera Wall Button */}
      <button
        type="button"
        onClick={() => onOpenWall?.()}
        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/40 font-mono-code font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(59,130,246,0.15)] active:scale-[0.98] cursor-pointer"
        title="Open Full Camera Wall Matrix"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>CAMERA WALL</span>
      </button>
    </div>
  );
};

export default PerimeterActionButtons;
