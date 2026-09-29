"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ALERTS_QUERY_KEY } from "@/services/queries/useAlertsQuery";
import { SNAPSHOTS_QUERY_KEY } from "@/services/queries/useSnapshotsQuery";
import { useDroneFlight } from "./useDroneFlight";
import { useCameraWall } from "./useCameraWall";
import { useTelemetryMetrics } from "./useTelemetryMetrics";
import { useAudioAlert } from "./useAudioAlert";
import { useAppSelector } from "@/store";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { streamApi } from "@/services/api/streamApi";
import { TacticalNavTab } from "@/types";


export function useDashboardOrchestrator() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TacticalNavTab>("airspace");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { view_mode } = useAppSelector((state) => state.telemetry);
  const { switchView } = useStreamMutation();

  const { threatLevel } = useTelemetryMetrics();
  const { isMuted, toggleMute } = useAudioAlert();
  const flight = useDroneFlight();
  const wall = useCameraWall();

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: SNAPSHOTS_QUERY_KEY });
  };

  const handleCaptureSnapshot = async () => {
    try {
      await streamApi.captureSnapshot();
      queryClient.invalidateQueries({ queryKey: SNAPSHOTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    } catch (e) {
      console.error("Failed to capture snapshot:", e);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleTabChange = (tab: TacticalNavTab) => {
    setActiveTab(tab);
    if (tab === "cameras") {
      wall.openWall();
    }
  };

  const handleViewSelect = async (view: "aerial" | "ground") => {
    await switchView.mutateAsync(view);
  };


  return {
    activeTab,
    setActiveTab,
    handleTabChange,
    isSidebarCollapsed,
    toggleSidebar,
    handleManualRefresh,
    handleCaptureSnapshot,
    threatLevel,
    isMuted,
    toggleMute,
    flight,
    wall,
    viewMode: (view_mode as "aerial" | "ground") || "aerial",
    handleViewSelect,
  };
}



export default useDashboardOrchestrator;
