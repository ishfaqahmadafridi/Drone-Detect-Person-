"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterZoomControlProps } from "@/types";
import { PERIMETER_ZOOM_PRESETS } from "@/constants/tactical";
import { ZoomIn } from "lucide-react";

export const PerimeterZoomControl: React.FC<PerimeterZoomControlProps> = ({
  activeZoom,
  onZoomChange,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.PerimeterZoomControl_div_className}>
      <div className={TACTICAL_VIEW_STYLES.PerimeterZoomControl_div_className_2}>
        <ZoomIn className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 grid grid-cols-3 gap-1">
        {PERIMETER_ZOOM_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.value}
            onClick={() => onZoomChange(preset.value)}
            aria-pressed={activeZoom === preset.value}
            className={`py-1 px-1.5 text-[10px] font-mono-code font-bold rounded transition-all cursor-pointer ${
              activeZoom === preset.value
                ? TACTICAL_VIEW_STYLES.PerimeterZoomControl_button_className
                : TACTICAL_VIEW_STYLES.PerimeterZoomControl_button_className_2
            }`}
            title={`Switch to ${preset.label}`}
          >
            {preset.label.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PerimeterZoomControl;
