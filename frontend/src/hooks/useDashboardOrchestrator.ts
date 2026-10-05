"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import { TAB_ROUTE_MAP, ROUTE_TAB_MAP } from "@/constants";

export function useDashboardOrchestrator(initialTab?: TacticalNavTab) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  // Resolve initial active tab from explicit prop, current pathname, or default to airspace
  const getTabFromPath = useCallback((path: string | null): TacticalNavTab => {
    if (!path) return "airspace";
    const cleanPath = path.toLowerCase().replace(/\/$/, "") || "/";
    return ROUTE_TAB_MAP[cleanPath] || "airspace";
  }, []);

  const [activeTab, setActiveTab] = useState<TacticalNavTab>(() => {
    if (initialTab) return initialTab;
    return getTabFromPath(pathname);
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { view_mode } = useAppSelector((state) => state.telemetry);
  const { switchView } = useStreamMutation();

  const { threatLevel } = useTelemetryMetrics();
  const { isMuted, toggleMute } = useAudioAlert();
  const flight = useDroneFlight();
  const wall = useCameraWall();

  // Sync state when browser navigation occurs (back/forward)
  useEffect(() => {
    if (pathname) {
      const routeTab = getTabFromPath(pathname);
      setActiveTab((current) => (current !== routeTab ? routeTab : current));
    }
  }, [pathname, getTabFromPath]);

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

  const handleTabChange = useCallback(
    (tab: TacticalNavTab) => {
      setActiveTab(tab);
      const targetRoute = TAB_ROUTE_MAP[tab] || "/drone";
      
      // Update browser URL seamlessly without reload
      if (pathname !== targetRoute) {
        router.push(targetRoute);
      }

      if (tab === "cameras") {
        wall.openWall();
      }
    },
    [pathname, router, wall]
  );

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
