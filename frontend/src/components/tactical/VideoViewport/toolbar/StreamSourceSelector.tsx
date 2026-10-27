"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { AERIAL_STREAM_SOURCES, GROUND_STREAM_SOURCES } from "@/constants/tactical";
import { StreamSourceSelectorProps, StreamSourceType } from "@/types";
import { Hexagon } from "lucide-react";

export const StreamSourceSelector: React.FC<StreamSourceSelectorProps> = ({
  sourceType,
  viewMode = "aerial",
  onSourceSelect,
}) => {
  const options = viewMode === "ground" ? GROUND_STREAM_SOURCES : AERIAL_STREAM_SOURCES;

  return (
    <div className="relative flex items-center select-none">
      <div className={TACTICAL_VIEW_STYLES.StreamSourceSelector_div_className}>
        <Hexagon className={TACTICAL_VIEW_STYLES.StreamSourceSelector_Hexagon_className} />
        <span className={TACTICAL_VIEW_STYLES.GroundStep4Review_span_className}>Select source</span>
        <select
          value={sourceType}
          onChange={(e) => onSourceSelect(e.target.value as StreamSourceType)}
          className={TACTICAL_VIEW_STYLES.StreamSourceSelector_select_className}
          aria-label="Select camera feed source"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className={TACTICAL_VIEW_STYLES.StreamSourceSelector_option_className}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StreamSourceSelector;
