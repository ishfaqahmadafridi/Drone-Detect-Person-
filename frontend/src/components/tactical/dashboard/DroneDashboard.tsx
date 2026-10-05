"use client";

import React from "react";
import { Header, TacticalWorkspace, TacticalOverlays } from "@/components/tactical";
import { useDashboardOrchestrator } from "@/hooks";
import { DroneDashboardProps } from "@/types";

export const DroneDashboard: React.FC<DroneDashboardProps> = ({ initialTab }) => {
  const {
    activeTab,
    isSidebarCollapsed,
    toggleSidebar,
    handleManualRefresh,
    handleCaptureSnapshot,
    threatLevel,
    isMuted,
    toggleMute,
    flight,
    wall,
    viewMode,
    handleViewSelect,
    handleTabChange,
  } = useDashboardOrchestrator(initialTab);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B0E14] text-slate-100">
      {/* 1. Global Tactical Command Bar */}
      <Header
        onRefresh={handleManualRefresh}
        avionics={flight.avionics}
        viewMode={viewMode}
      />

      {/* 2. Workspace Body: Left Sidebar + Center Command Viewport */}
      <TacticalWorkspace
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onOpenWall={wall.openWall}
        avionics={flight.avionics}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        threatLevel={threatLevel}
        viewMode={viewMode}
        onViewSelect={handleViewSelect}
        flightState={flight.flightState}
        altitude={flight.altitude}
        batteryPercent={flight.batteryPercent}
        isCommandPending={flight.isCommandPending}
        onCommand={flight.handleCommand}
        onConnectAirLink={flight.handleConnectDroneLink}
        onOpenFlightDeck={flight.handleLaunchDroneFlight}
        onRefresh={handleManualRefresh}
        onSnapshotTrigger={handleCaptureSnapshot}
      />

      {/* 3. Tactical Modal & Multi-Camera Overlays */}
      <TacticalOverlays wall={wall} />
    </div>
  );
};

export default DroneDashboard;
