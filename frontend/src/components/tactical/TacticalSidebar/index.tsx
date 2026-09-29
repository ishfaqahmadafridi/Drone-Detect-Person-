"use client";

import React from "react";
import { TacticalSidebarProps } from "@/types";
import { normalizeAvionicsMetrics } from "@/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarPerspectiveToggle } from "./SidebarPerspectiveToggle";
import { SidebarNavList } from "./SidebarNavList";
import { SidebarTelemetryWidget } from "./SidebarTelemetryWidget";
import { SidebarFooter } from "./SidebarFooter";

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
      className={`relative flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-cyan-500/20 bg-slate-950/95 backdrop-blur-xl z-30 select-none shadow-[4px_0_24px_rgba(0,0,0,0.5)] ${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* 1. Header: Shield Icon, Title, and UAV Link Status */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        flightState={flightState}
        isAirborne={isAirborne}
      />

      {/* 2. Surveillance Vision Perspective Switcher */}
      {onViewSelect && (
        <div className="px-2 pt-1 pb-2 border-b border-slate-800/80">
          <SidebarPerspectiveToggle
            viewMode={viewMode}
            onViewSelect={onViewSelect}
            isCollapsed={isCollapsed}
          />
        </div>
      )}

      {/* 3. Navigation Modes List */}
      <SidebarNavList
        activeTab={activeTab}
        onTabChange={onTabChange}
        isCollapsed={isCollapsed}
        onOpenWall={onOpenWall}
        threatLevel={threatLevel}
      />


      {/* 3. Real-Time Telemetry Mini-Card */}
      {!isCollapsed && (
        <SidebarTelemetryWidget
          batteryPct={battery}
          isBatteryLow={isBatteryLow}
          altitude={altitude}
          speed={speed}
        />
      )}

      {/* 4. Footer: Siren Alert Control & Engine Status */}
      <SidebarFooter
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        isCollapsed={isCollapsed}
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

