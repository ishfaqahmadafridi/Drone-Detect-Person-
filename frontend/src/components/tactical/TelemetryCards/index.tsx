"use client";

import React from "react";
import { useTelemetryMetrics } from "@/hooks";
import { PersonsMetricCard } from "./PersonsMetricCard";
import { IntrudersMetricCard } from "./IntrudersMetricCard";
import { GatheringsMetricCard } from "./GatheringsMetricCard";
import { SpeedMetricCard } from "./SpeedMetricCard";

export const TelemetryCards: React.FC = () => {
  const { totalPersons, intrudersCount, gatheringPairs, fps, multiPersonThreshold } =
    useTelemetryMetrics();

  return (
    <div className="grid grid-cols-2 gap-3">
      <PersonsMetricCard count={totalPersons} />
      <IntrudersMetricCard count={intrudersCount} />
      <GatheringsMetricCard count={gatheringPairs} threshold={multiPersonThreshold} />
      <SpeedMetricCard fps={fps} />
    </div>
  );
};

export default TelemetryCards;
