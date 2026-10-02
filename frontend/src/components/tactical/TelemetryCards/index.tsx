"use client";

import React, { useState } from "react";
import { useTelemetryMetrics } from "@/hooks";
import { TelemetryCardsProps } from "@/types";
import { DetectedPersonsModal } from "./DetectedPersonsModal";
import { TelemetryCardTile } from "./TelemetryCardTile";

export const TelemetryCards: React.FC<TelemetryCardsProps> = ({
  viewMode: propViewMode,
  layout = "horizontal",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    totalPersons,
    intrudersCount,
    gatheringPairs,
    viewMode: hookViewMode,
  } = useTelemetryMetrics();

  const activeViewMode = propViewMode || hookViewMode || "aerial";

  // Data matching the 5 telemetry cards in the target enterprise operations dashboard
  const cards = [
    {
      id: "persons",
      title: "Total Persons",
      value: String(totalPersons).padStart(2, "0"),
      subText: "Detected tracks",
      isAlert: false,
      onClick: () => setIsModalOpen(true),
    },
    {
      id: "intruders",
      title: "Active Intruders",
      value: String(intrudersCount).padStart(2, "0"),
      subText: "Restricted zone",
      isAlert: intrudersCount > 0,
      onClick: undefined,
    },
    {
      id: "gatherings",
      title: "Gathering Clusters",
      value: String(gatheringPairs).padStart(2, "0"),
      subText: "Group review",
      isAlert: gatheringPairs > 0,
      onClick: undefined,
    },
    {
      id: "evidence",
      title: "Evidence Captures",
      value: "12",
      subText: "Demo session",
      isAlert: false,
      onClick: undefined,
    },
    {
      id: "latency",
      title: "System Latency",
      value: "48 ms",
      subText: "Nominal range",
      isAlert: false,
      onClick: undefined,
    },
  ];

  const gridClass =
    layout === "horizontal"
      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      : "grid grid-cols-2 gap-3";

  return (
    <>
      <div className={gridClass}>
        {cards.map((c) => (
          <TelemetryCardTile
            key={c.id}
            title={c.title}
            value={c.value}
            subText={c.subText}
            isAlert={c.isAlert}
            onClick={c.onClick}
          />
        ))}
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
export * from "./TelemetryCardTile";
export * from "./PersonsMetricCard";
export * from "./IntrudersMetricCard";
export * from "./GatheringsMetricCard";
export * from "./SpeedMetricCard";
export * from "./DetectedPersonsModal";
