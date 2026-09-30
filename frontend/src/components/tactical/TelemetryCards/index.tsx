"use client";

import React from "react";
import { useTelemetryMetrics } from "@/hooks";
import { TelemetryCardsProps } from "@/types";
import { PersonsMetricCard } from "./PersonsMetricCard";
import { IntrudersMetricCard } from "./IntrudersMetricCard";
import { GatheringsMetricCard } from "./GatheringsMetricCard";
import { SpeedMetricCard } from "./SpeedMetricCard";

export const TelemetryCards: React.FC<TelemetryCardsProps> = ({
  viewMode: propViewMode,
}) => {
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
    <div className="grid grid-cols-2 gap-3">
      <PersonsMetricCard count={totalPersons} viewMode={activeViewMode} />
      <IntrudersMetricCard count={intrudersCount} />
      <GatheringsMetricCard count={gatheringPairs} threshold={multiPersonThreshold} />
      <SpeedMetricCard fps={fps} />
    </div>
  );
};

export default TelemetryCards;
