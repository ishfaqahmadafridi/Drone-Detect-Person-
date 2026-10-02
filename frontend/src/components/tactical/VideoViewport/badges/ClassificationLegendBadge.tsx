"use client";

import React from "react";
import { ClassificationLegendBadgeProps } from "@/types";
import { CLASSIFICATION_LEGEND_ITEMS } from "@/constants/tactical";

export const ClassificationLegendBadge: React.FC<ClassificationLegendBadgeProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`absolute bottom-9 left-3.5 right-3.5 z-20 pointer-events-none flex flex-col gap-1 select-none ${className}`}
    >
      <div className="self-start px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-sm border border-slate-700/60 font-mono-code text-[10px] text-slate-300 flex items-center gap-3 shadow-md">
        {CLASSIFICATION_LEGEND_ITEMS.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ClassificationLegendBadge;
