"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { HeaderRefreshButtonProps } from "@/types";
import { RotateCw } from "lucide-react";

export const HeaderRefreshButton: React.FC<HeaderRefreshButtonProps> = ({ onRefresh }) => {
  return (
    <button
      onClick={onRefresh}
      className={TACTICAL_VIEW_STYLES.HeaderRefreshButton_button_className}
      title="Refresh Telemetry & Alerts"
      aria-label="Refresh telemetry and alerts"
    >
      <RotateCw className="w-4 h-4" />
    </button>
  );
};

export default HeaderRefreshButton;
