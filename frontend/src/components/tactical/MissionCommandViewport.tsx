"use client";

import React from "react";
import { MissionCommandViewportProps } from "@/types";
import { TacticalViewRouter } from "./views/TacticalViewRouter";

export const MissionCommandViewport: React.FC<MissionCommandViewportProps> = ({
  activeTab,
  isCommandPending,
  onCommand,
  onRefresh,
  onSnapshotTrigger,
  viewMode,
  onOpenWall,
  onTabChange,
}) => {
  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto min-w-0 p-4 md:p-6 gap-5">
      {/* Dynamic Command Modes */}
      <TacticalViewRouter
        activeTab={activeTab}
        onSnapshotTrigger={onSnapshotTrigger || onRefresh}
        isCommandPending={isCommandPending}
        onCommand={onCommand}
        viewMode={viewMode}
        onOpenWall={onOpenWall}
        onTabChange={onTabChange}
      />
    </main>
  );
};
