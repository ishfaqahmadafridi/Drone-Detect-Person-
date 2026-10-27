"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterNightVisionButtonProps } from "@/types";
import { Moon } from "lucide-react";

export const PerimeterNightVisionButton: React.FC<PerimeterNightVisionButtonProps> = ({
  isEnabled,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-mono-code font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] ${
        isEnabled
          ? TACTICAL_VIEW_STYLES.PerimeterNightVisionButton_button_className
          : TACTICAL_VIEW_STYLES.PerimeterNightVisionButton_button_className_2
      }`}
      title="Toggle IR Night Vision Sensor Filter"
    >
      <Moon className={`w-3.5 h-3.5 ${isEnabled ? TACTICAL_VIEW_STYLES.PerimeterNightVisionButton_Moon_className : ""}`} />
      <span>IR CUT: {isEnabled ? "AUTO (ON)" : "OFF"}</span>
    </button>
  );
};

export default PerimeterNightVisionButton;
