"use client";

import React from "react";
import { ViewportLayoutSelectorProps, ViewportLayoutMode } from "@/types";
import { VIEWPORT_LAYOUT_OPTIONS } from "@/constants/tactical";
import { Square, SplitSquareVertical, LayoutGrid } from "lucide-react";

const renderLayoutIcon = (mode: ViewportLayoutMode) => {
  switch (mode) {
    case "single":
      return <Square className="w-3.5 h-3.5" />;
    case "dual":
      return <SplitSquareVertical className="w-3.5 h-3.5" />;
    case "quad":
      return <LayoutGrid className="w-3.5 h-3.5" />;
  }
};

export const ViewportLayoutSelector: React.FC<ViewportLayoutSelectorProps> = ({
  layoutMode,
  onLayoutChange,
}) => {
  return (
    <div className="flex items-center p-0.5 rounded-lg bg-[#06080E] border border-slate-700/60 shadow-inner">
      {VIEWPORT_LAYOUT_OPTIONS.map(({ mode, label, tooltip }) => {
        const isActive = layoutMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onLayoutChange(mode)}
            title={tooltip}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-mono-code text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
              isActive
                ? "bg-blue-600/30 text-blue-300 border border-blue-500/60 shadow-[0_0_10px_rgba(59,130,246,0.25)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            {renderLayoutIcon(mode)}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewportLayoutSelector;
