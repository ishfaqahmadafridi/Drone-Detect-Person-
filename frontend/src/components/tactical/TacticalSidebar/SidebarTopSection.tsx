"use client";

import React from "react";
import { SidebarTopSectionProps } from "@/types";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarPerspectiveToggle } from "./SidebarPerspectiveToggle";
import { SidebarNavList } from "./SidebarNavList";

export const SidebarTopSection: React.FC<SidebarTopSectionProps> = ({
  isCollapsed,
  onToggleCollapse,
  flightState,
  isAirborne,
  viewMode = "aerial",
  onViewSelect,
  activeTab,
  onTabChange,
  onOpenWall,
  threatLevel,
}) => {
  return (
    <div className="flex flex-col min-w-0">
      {/* 1. Header: Shield Icon, Title, and UAV/Camera Link Status */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        flightState={flightState}
        isAirborne={isAirborne}
        viewMode={viewMode}
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
    </div>
  );
};

export default SidebarTopSection;
