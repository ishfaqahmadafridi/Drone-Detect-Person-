"use client";

import React from "react";
import { RecordingsFilterTabsProps } from "@/types";
import { RECORDINGS_FILTER_OPTIONS } from "@/constants/tactical";

export const RecordingsFilterTabs: React.FC<RecordingsFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex gap-1.5 bg-slate-900/50 rounded-lg p-1 border border-slate-800/60">
      {RECORDINGS_FILTER_OPTIONS.map((opt) => {
        const isActive = activeFilter === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`flex-1 py-1.5 rounded-md text-[10px] font-mono-code font-bold tracking-wider transition-all ${
              isActive
                ? "bg-purple-500/25 text-purple-200 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default RecordingsFilterTabs;
