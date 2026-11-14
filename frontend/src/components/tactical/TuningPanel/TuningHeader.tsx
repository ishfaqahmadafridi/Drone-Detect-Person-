"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SlidersHorizontal, CircleCheck, ChevronDown, ChevronUp } from "lucide-react";
import { TuningHeaderProps } from "@/types";

export const TuningHeader: React.FC<TuningHeaderProps> = ({
  showSavedToast,
  isOpen = true,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between group cursor-pointer focus:outline-none"
    >
      <div className="flex items-center gap-2">
        <SlidersHorizontal className={TACTICAL_VIEW_STYLES.TuningHeader_Sliders_className} />
        <h3 className={TACTICAL_VIEW_STYLES.TuningHeader_h3_className}>
          SURVEILLANCE PARAMETERS
        </h3>
      </div>
      <div className="flex items-center gap-2">
        {showSavedToast && (
          <span className={TACTICAL_VIEW_STYLES.TuningHeader_span_className}>
            <CircleCheck className="w-3.5 h-3.5" /> Updated
          </span>
        )}
        <span className={TACTICAL_VIEW_STYLES.TuningHeader_span_className_2}>
          {isOpen ? (
            <>
              <span>COLLAPSE</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span className={TACTICAL_VIEW_STYLES.TuningHeader_span_className_3}>&gt; CLICK TO OPEN</span>
              <ChevronDown className={TACTICAL_VIEW_STYLES.GroundStep3Form_Network_className} />
            </>
          )}
        </span>
      </div>
    </button>
  );
};
