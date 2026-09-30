"use client";

import React from "react";
import { SidebarBottomSectionProps } from "@/types";
import { SidebarTelemetryWidget } from "./SidebarTelemetryWidget";
import { SidebarFooter } from "./SidebarFooter";

export const SidebarBottomSection: React.FC<SidebarBottomSectionProps> = ({
  isCollapsed,
  batteryPct,
  isBatteryLow,
  altitude,
  speed,
  viewMode = "aerial",
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="flex flex-col min-w-0">
      {/* 1. Real-Time Telemetry Mini-Card */}
      {!isCollapsed && (
        <SidebarTelemetryWidget
          batteryPct={batteryPct}
          isBatteryLow={isBatteryLow}
          altitude={altitude}
          speed={speed}
          viewMode={viewMode}
        />
      )}

      {/* 2. Footer: Siren Alert Control & Engine Status */}
      <SidebarFooter
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        isCollapsed={isCollapsed}
      />
    </div>
  );
};

export default SidebarBottomSection;
