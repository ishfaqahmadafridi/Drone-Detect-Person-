"use client";

import React from "react";
import { TacticalSidebarProps } from "@/types";
import { normalizeAvionicsMetrics } from "@/utils";
import { SidebarTopSection } from "./SidebarTopSection";
import { SidebarBottomSection } from "./SidebarBottomSection";

export const TacticalSidebar: React.FC<TacticalSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  onOpenWall,
  avionics,
  isMuted,
  onToggleMute,
  threatLevel,
  viewMode = "aerial",
  onViewSelect,
}) => {
  const { flightState, battery, isAirborne, isBatteryLow, altitude, speed } =
    normalizeAvionicsMetrics(avionics);

  return (
    <aside
      className={`shrink-0 relative flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-slate-700/60 bg-[#0B0E14] z-30 select-none shadow-[4px_0_24px_rgba(0,0,0,0.5)] ${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* 1. Top Section: Header, Surveillance Perspective, and Navigation Modes */}
      <SidebarTopSection
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        flightState={flightState}
        isAirborne={isAirborne}
        viewMode={viewMode}
        onViewSelect={onViewSelect}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenWall={onOpenWall}
        threatLevel={threatLevel}
      />

      {/* 2. Bottom Section: Telemetry Mini-Card and Audio / System Status Footer */}
      <SidebarBottomSection
        isCollapsed={isCollapsed}
        batteryPct={battery}
        isBatteryLow={isBatteryLow}
        altitude={altitude}
        speed={speed}
        viewMode={viewMode}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
      />
    </aside>
  );
};

export default TacticalSidebar;
export * from "./SidebarHeader";
export * from "./SidebarPerspectiveToggle";
export * from "./SidebarNavList";
export * from "./SidebarNavItem";
export * from "./SidebarCameraWallTrigger";
export * from "./SidebarTelemetryWidget";
export * from "./SidebarFooter";
export * from "./SidebarTopSection";
export * from "./SidebarBottomSection";
export * from "./SidebarSystemHealth";

