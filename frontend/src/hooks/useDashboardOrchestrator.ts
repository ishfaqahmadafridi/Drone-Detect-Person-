"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ALERTS_QUERY_KEY } from "@/services/queries/useAlertsQuery";
import { SNAPSHOTS_QUERY_KEY } from "@/services/queries/useSnapshotsQuery";
import { useCameraWall } from "./useCameraWall";
import { useTelemetryMetrics } from "./useTelemetryMetrics";
import { useAppSelector } from "@/store";
import { usePerspectiveSelection } from "./usePerspectiveSelection";
import { streamApi } from "@/services/api/streamApi";
import { TacticalNavTab } from "@/types";
import { TAB_ROUTE_MAP, ROUTE_TAB_MAP } from "@/constants";
import { SIDEBAR_AUTO_COLLAPSE_QUERY } from "@/constants/tactical";

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

  const routeTab = getTabFromPath(pathname);
  const [selectedTab, setSelectedTab] = useState<TacticalNavTab | null>(initialTab || null);
  const activeTab = selectedTab ?? routeTab;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Narrow screens start collapsed (read after mount to keep SSR markup stable) and follow resizes.
  useEffect(() => {
    const query = window.matchMedia(SIDEBAR_AUTO_COLLAPSE_QUERY);
    const sync = () => setIsSidebarCollapsed(query.matches);
    const frame = requestAnimationFrame(sync);
    query.addEventListener("change", sync);
    return () => { cancelAnimationFrame(frame); query.removeEventListener("change", sync); };
  }, []);

  const { view_mode } = useAppSelector((state) => state.telemetry);
  const selectPerspective = usePerspectiveSelection();

  const { threatLevel } = useTelemetryMetrics();
  const wall = useCameraWall();

  const handleCaptureSnapshot = async () => {
    await streamApi.captureSnapshot(view_mode);
    queryClient.invalidateQueries({ queryKey: SNAPSHOTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleViewSelect = useCallback(
    async (view: "aerial" | "ground") => {
      await selectPerspective(view);
      setSelectedTab("airspace");
    },
    [selectPerspective]
  );

  const handleTabChange = useCallback(
    (tab: TacticalNavTab) => {
      setSelectedTab(tab);
      const targetRoute = TAB_ROUTE_MAP[tab] || "/drone";

      // Update browser URL seamlessly without reload
      if (pathname !== targetRoute) {
        router.push(targetRoute);
      }

      if (tab === "cameras") wall.openWall();
    },
    [pathname, router, wall]
  );

  return {
    activeTab,
    setActiveTab: handleTabChange,
    handleTabChange,
    isSidebarCollapsed,
    toggleSidebar,
    handleCaptureSnapshot,
    threatLevel,
    wall,
    viewMode: (view_mode as "aerial" | "ground") || "aerial",
    handleViewSelect,
  };
}

export default useDashboardOrchestrator;
