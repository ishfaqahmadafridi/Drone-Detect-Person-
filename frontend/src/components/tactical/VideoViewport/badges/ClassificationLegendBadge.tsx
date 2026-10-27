"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
      <div className={TACTICAL_VIEW_STYLES.ClassificationLegendBadge_div_className}>
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
