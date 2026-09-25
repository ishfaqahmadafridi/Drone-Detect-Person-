"use client";

import React from "react";
import {
  Header,
  VideoViewport,
  TelemetryCards,
  TuningPanel,
  IncidentLogs,
  SnapshotGallery,
} from "@/components/tactical";
import { useQueryClient } from "@tanstack/react-query";
import { ALERTS_QUERY_KEY } from "@/services/queries/useAlertsQuery";
import { SNAPSHOTS_QUERY_KEY } from "@/services/queries/useSnapshotsQuery";

export default function DroneDashboardPage() {
  const queryClient = useQueryClient();

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: SNAPSHOTS_QUERY_KEY });
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 gap-5 max-w-[1700px] mx-auto">
      {/* 1. TOP TACTICAL HEADER */}
      <Header onRefresh={handleManualRefresh} />

      {/* 2. MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-5">
        {/* Left Column: Primary Video Viewport & Evidence Captures */}
        <div className="flex flex-col gap-4">
          <VideoViewport onSnapshotTrigger={handleManualRefresh} />
          <SnapshotGallery />
        </div>

        {/* Right Column: Telemetry Cards, Parameter Tuning, Incident Feed */}
        <div className="flex flex-col gap-4">
          <TelemetryCards />
          <TuningPanel />
          <IncidentLogs />
        </div>
      </div>
    </div>
  );
}
