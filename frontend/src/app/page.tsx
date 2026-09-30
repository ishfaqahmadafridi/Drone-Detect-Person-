"use client";

import React from "react";
import {
  TacticalSidebar,
  MissionCommandViewport,
  CameraWallModal,
} from "@/components/tactical";
import { useDashboardOrchestrator } from "@/hooks";

export default function DroneDashboardPage() {
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
  } = useDashboardOrchestrator();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#030712] text-slate-100">
      {/* 1. Tactical Navigation Sidebar */}
      <TacticalSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onOpenWall={wall.openWall}

        avionics={flight.avionics}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        threatLevel={threatLevel}
        viewMode={viewMode}
        onViewSelect={handleViewSelect}
      />


      {/* 2. Main Mission Command Viewport */}
      <MissionCommandViewport
        activeTab={activeTab}
        avionics={flight.avionics}
        flightState={flight.flightState}
        altitude={flight.altitude}
        batteryPercent={flight.batteryPercent}
        isCommandPending={flight.isCommandPending}
        onCommand={flight.handleCommand}
        onConnectAirLink={flight.handleConnectDroneLink}
        onOpenFlightDeck={flight.handleLaunchDroneFlight}
        onRefresh={handleManualRefresh}
        onSnapshotTrigger={handleCaptureSnapshot}
        viewMode={viewMode}
        onOpenWall={wall.openWall}
      />

      {/* 3. Multi-Sensor Camera Wall Modal */}
      <CameraWallModal
        isOpen={wall.isWallOpen}
        activeSource={wall.activeSource}
        onClose={wall.closeWall}
        onSelectFeed={wall.selectFeed}
        onConnectRtsp={wall.connectRtsp}
      />
    </div>
  );
}
