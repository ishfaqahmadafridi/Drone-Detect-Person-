"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SidebarTopSectionProps } from "@/types";
import { SidebarPerspectiveToggle } from "./SidebarPerspectiveToggle";
import { SidebarNavList } from "./SidebarNavList";
import { ChevronRight } from "lucide-react";


export const SidebarTopSection: React.FC<SidebarTopSectionProps> = ({
  isCollapsed,
  onToggleCollapse,
  viewMode = "aerial",
  onViewSelect,
  activeTab,
  onTabChange,
  threatLevel,
}) => {
  return (
    <div className="flex flex-col min-w-0">
      {/* 1. Collapse toggle button when collapsed */}
      {isCollapsed && (
        <div className={TACTICAL_VIEW_STYLES.SidebarTopSection_div_className}>
          <button
            onClick={onToggleCollapse}
            className={TACTICAL_VIEW_STYLES.SidebarTopSection_button_className}
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Surveillance Vision Perspective Switcher */}
      {onViewSelect && (
        <div className={TACTICAL_VIEW_STYLES.SidebarTopSection_div_className_2}>
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
        threatLevel={threatLevel}
      />
    </div>
  );
};

export default SidebarTopSection;
