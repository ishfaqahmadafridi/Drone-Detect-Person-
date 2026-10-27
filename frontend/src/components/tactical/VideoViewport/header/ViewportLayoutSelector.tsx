"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
    <div className={TACTICAL_VIEW_STYLES.ViewportLayoutSelector_div_className}>
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
                ? TACTICAL_VIEW_STYLES.ViewportLayoutSelector_button_className
                : TACTICAL_VIEW_STYLES.ViewportLayoutSelector_button_className_2
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
