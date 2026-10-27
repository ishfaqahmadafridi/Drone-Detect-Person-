"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { StreamFilterControlsProps } from "@/types";
import { Moon } from "lucide-react";

export const StreamFilterControls: React.FC<StreamFilterControlsProps> = ({
  isNightVision,
  onToggleNightVision,
}) => {
  return (
    <button
      onClick={onToggleNightVision}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] select-none ${
        isNightVision
          ? TACTICAL_VIEW_STYLES.StreamFilterControls_button_className
          : TACTICAL_VIEW_STYLES.StreamFilterControls_button_className_2
      }`}
      title="Toggle Night Vision / Infrared Sensor Filter"
    >
      <Moon className={`w-3.5 h-3.5 ${isNightVision ? TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className : TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className_3}`} />
      <span>IR: {isNightVision ? "On" : "Off"}</span>
    </button>
  );
};

export default StreamFilterControls;
