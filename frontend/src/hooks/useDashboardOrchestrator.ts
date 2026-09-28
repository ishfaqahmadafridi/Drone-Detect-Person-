"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ALERTS_QUERY_KEY } from "@/services/queries/useAlertsQuery";
import { SNAPSHOTS_QUERY_KEY } from "@/services/queries/useSnapshotsQuery";
import { useDroneFlight } from "./useDroneFlight";
import { useCameraWall } from "./useCameraWall";
import { useTelemetryMetrics } from "./useTelemetryMetrics";
import { useAudioAlert } from "./useAudioAlert";
import { TacticalNavTab } from "@/types";

export function useDashboardOrchestrator() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TacticalNavTab>("airspace");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { threatLevel } = useTelemetryMetrics();
  const { isMuted, toggleMute } = useAudioAlert();
  const flight = useDroneFlight();
  const wall = useCameraWall();

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: SNAPSHOTS_QUERY_KEY });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    handleManualRefresh,
    threatLevel,
    isMuted,
    toggleMute,
    flight,
    wall,
  };
}

export default useDashboardOrchestrator;
