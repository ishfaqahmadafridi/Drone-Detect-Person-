"use client";

import React from "react";
import { HeaderRefreshButtonProps } from "@/types";
import { RotateCw } from "lucide-react";

export const HeaderRefreshButton: React.FC<HeaderRefreshButtonProps> = ({ onRefresh }) => {
  return (
    <button
      onClick={onRefresh}
      className="p-2 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:border-blue-400/50 hover:text-blue-400 transition-colors cursor-pointer"
      title="Refresh Telemetry & Alerts"
      aria-label="Refresh telemetry and alerts"
    >
      <RotateCw className="w-4 h-4" />
    </button>
  );
};

export default HeaderRefreshButton;
