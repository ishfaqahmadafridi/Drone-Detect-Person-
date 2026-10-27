"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { RecordingsFilterTabsProps } from "@/types";
import { RECORDINGS_FILTER_OPTIONS } from "@/constants/tactical";

export const RecordingsFilterTabs: React.FC<RecordingsFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.RecordingsFilterTabs_div_className}>
      {RECORDINGS_FILTER_OPTIONS.map((opt) => {
        const isActive = activeFilter === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`flex-1 py-1.5 rounded-md text-[10px] font-mono-code font-bold tracking-wider transition-all ${
              isActive
                ? TACTICAL_VIEW_STYLES.RecordingsFilterTabs_button_className
                : TACTICAL_VIEW_STYLES.RecordingsFilterTabs_button_className_2
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
