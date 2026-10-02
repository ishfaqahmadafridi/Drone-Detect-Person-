"use client";

import React from "react";
import { TacticalWorkspaceProps } from "@/types";
import { TacticalSidebar } from "../TacticalSidebar";
import { MissionCommandViewport } from "../MissionCommandViewport";

export const TacticalWorkspace: React.FC<TacticalWorkspaceProps> = ({
  activeTab,
  onTabChange,
  isSidebarCollapsed,
  onToggleCollapse,
  onOpenWall,
  avionics,
  isMuted,
  onToggleMute,
  threatLevel,
  viewMode,
  onViewSelect,
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
  onConnectAirLink,
  onOpenFlightDeck,
  onRefresh,
  onSnapshotTrigger,
}) => {
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Primary Workspace Left: Collapsible Tactical Sidebar */}
      <TacticalSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={onToggleCollapse}
        onOpenWall={onOpenWall}
        avionics={avionics}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        threatLevel={threatLevel}
        viewMode={viewMode}
        onViewSelect={onViewSelect}
      />

      {/* Primary Workspace Center: Dynamic Mission Command Viewport */}
      <MissionCommandViewport
        activeTab={activeTab}
        avionics={avionics}
        flightState={flightState}
        altitude={altitude}
        batteryPercent={batteryPercent}
        isCommandPending={isCommandPending}
        onCommand={onCommand}
        onConnectAirLink={onConnectAirLink}
        onOpenFlightDeck={onOpenFlightDeck}
        onRefresh={onRefresh}
        onSnapshotTrigger={onSnapshotTrigger}
        viewMode={viewMode}
        onOpenWall={onOpenWall}
        onTabChange={onTabChange}
      />
    </div>
  );
};

export default TacticalWorkspace;
