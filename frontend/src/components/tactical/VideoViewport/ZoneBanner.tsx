"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { ZoneBannerProps } from "@/types";
import { Check, RotateCcw, Trash2, X } from "lucide-react";

export const ZoneBanner: React.FC<ZoneBannerProps> = ({ onSave, onReset, onClear, onCancel }) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.ZoneBanner_div_className}>
      <span className={TACTICAL_VIEW_STYLES.ZoneBanner_span_className}>
        🎯 <strong>ZONE EDITOR:</strong> Drag points or click to place vertices.
      </span>
      <div className="flex gap-1.5">
        <button
          onClick={onSave}
          className={TACTICAL_VIEW_STYLES.ZoneBanner_button_className}
        >
          <Check className="w-3 h-3" /> Save
        </button>
        <button
          onClick={onReset}
          className={TACTICAL_VIEW_STYLES.ZoneBanner_button_className_2}
          title="Reset to default zone coordinates"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        {onClear && (
          <button
            onClick={onClear}
            className={TACTICAL_VIEW_STYLES.ZoneBanner_button_className_3}
            title="Remove and disable restricted zone"
          >
            <Trash2 className="w-3 h-3" /> Remove Zone
          </button>
        )}
        <button
          onClick={onCancel}
          className={TACTICAL_VIEW_STYLES.ZoneBanner_button_className_4}
          aria-label="Cancel editing"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
