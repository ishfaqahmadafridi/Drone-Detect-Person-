"use client";

import React from "react";
import { Film, RefreshCw } from "lucide-react";
import { RecordingsHeaderProps } from "@/types";

export const RecordingsHeader: React.FC<RecordingsHeaderProps> = ({
  totalCount,
  filteredCount,
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
          <Film className="w-4 h-4 text-purple-300" />
        </div>
        <div>
          <h2 className="font-display text-sm font-bold text-slate-100 tracking-wider uppercase">
            Evidence Records
          </h2>
          <p className="text-[10px] font-mono-code text-slate-400">
            {filteredCount} stored frame{filteredCount !== 1 ? "s" : ""}
            {totalCount !== filteredCount ? ` (filtered from ${totalCount})` : ""} · auto-captured on threat detection
          </p>
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-300 text-[10px] font-mono-code transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
        REFRESH
      </button>
    </div>
  );
};

export default RecordingsHeader;
