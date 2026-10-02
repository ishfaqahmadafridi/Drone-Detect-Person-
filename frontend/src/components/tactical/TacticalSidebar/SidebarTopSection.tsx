"use client";

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
        <div className="p-2 border-b border-slate-800 flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer active:scale-95 transition-all"
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Surveillance Vision Perspective Switcher */}
      {onViewSelect && (
        <div className="border-b border-slate-800/80">
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
