"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { TacticalSidebarProps } from "@/types";
import { SidebarTopSection } from "./SidebarTopSection";
import { SidebarBottomSection } from "./SidebarBottomSection";

export const TacticalSidebar: React.FC<TacticalSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  threatLevel,
  viewMode = "aerial",
  onViewSelect,
}) => {
  return (
    <aside
      className={`${TACTICAL_VIEW_STYLES.TacticalSidebar_aside_className}${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* 1. Top Section: Header, Surveillance Perspective, and Navigation Modes */}
      <SidebarTopSection
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        viewMode={viewMode}
        onViewSelect={onViewSelect}
        activeTab={activeTab}
        onTabChange={onTabChange}
        threatLevel={threatLevel}
      />

      {/* 2. Bottom Section: Telemetry Mini-Card and Audio / System Status Footer */}
      <SidebarBottomSection
        isCollapsed={isCollapsed}
      />
    </aside>
  );
};

export default TacticalSidebar;
export * from "./SidebarPerspectiveToggle";
export * from "./SidebarNavList";
export * from "./SidebarNavItem";
export * from "./SidebarTopSection";
export * from "./SidebarBottomSection";
export * from "./SidebarSystemHealth";
