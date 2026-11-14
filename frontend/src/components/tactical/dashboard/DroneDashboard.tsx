"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Header, TacticalWorkspace, TacticalOverlays } from "@/components/tactical";
import { useDashboardOrchestrator } from "@/hooks";
import { DroneDashboardProps } from "@/types";

export const DroneDashboard: React.FC<DroneDashboardProps> = ({ initialTab }) => {
  const {
    activeTab,
    isSidebarCollapsed,
    toggleSidebar,
    handleCaptureSnapshot,
    threatLevel,
    wall,
    viewMode,
    handleViewSelect,
    handleTabChange,
  } = useDashboardOrchestrator(initialTab);

  return (
    <div className={TACTICAL_VIEW_STYLES.DroneDashboard_div_className}>
      {/* 1. Global Tactical Command Bar */}
      <Header />

      {/* 2. Workspace Body: Left Sidebar + Center Command Viewport */}
      <TacticalWorkspace
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onOpenWall={wall.openWall}
        threatLevel={threatLevel}
        viewMode={viewMode}
        onViewSelect={handleViewSelect}
        onSnapshotTrigger={handleCaptureSnapshot}
      />

      {/* 3. Tactical Modal & Multi-Camera Overlays */}
      <TacticalOverlays wall={wall} />
    </div>
  );
};

export default DroneDashboard;
