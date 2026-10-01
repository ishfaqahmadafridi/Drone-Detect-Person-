"use client";

import React, { useState } from "react";
import { useTelemetryMetrics } from "@/hooks";
import { TelemetryCardsProps } from "@/types";
import { PersonsMetricCard } from "./PersonsMetricCard";
import { IntrudersMetricCard } from "./IntrudersMetricCard";
import { GatheringsMetricCard } from "./GatheringsMetricCard";
import { SpeedMetricCard } from "./SpeedMetricCard";
import { DetectedPersonsModal } from "./DetectedPersonsModal";

export const TelemetryCards: React.FC<TelemetryCardsProps> = ({
  viewMode: propViewMode,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    totalPersons,
    intrudersCount,
    gatheringPairs,
    fps,
    multiPersonThreshold,
    viewMode: hookViewMode,
  } = useTelemetryMetrics();

  const activeViewMode = propViewMode || hookViewMode || "aerial";

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <PersonsMetricCard
          count={totalPersons}
          viewMode={activeViewMode}
          onClick={() => setIsModalOpen(true)}
        />
        <IntrudersMetricCard count={intrudersCount} />
        <GatheringsMetricCard count={gatheringPairs} threshold={multiPersonThreshold} />
        <SpeedMetricCard fps={fps} />
      </div>

      {/* Real-time Target Inspector Modal */}
      <DetectedPersonsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        viewMode={activeViewMode}
      />
    </>
  );
};

export default TelemetryCards;
export * from "./MetricTile";
export * from "./PersonsMetricCard";
export * from "./IntrudersMetricCard";
export * from "./GatheringsMetricCard";
export * from "./SpeedMetricCard";
export * from "./DetectedPersonsModal";

