"use client";

import React from "react";
import { CalibrationViewProps } from "@/types";
import { useAppSelector } from "@/store";
import { TuningPanel } from "../TuningPanel";
import { TelemetryCards } from "../TelemetryCards";
import { DroneAvionicsCard } from "../DroneAvionicsCard";
import { PerimeterCameraCard } from "../PerimeterCameraCard";

import { useStreamMutation } from "@/services/queries/useStreamMutation";

export const CalibrationView: React.FC<CalibrationViewProps> = ({
  avionics,
  onOpenFlightDeck,
  onConnectAirLink,
  viewMode: propViewMode,
  onOpenWall,
}) => {
  const storeViewMode = useAppSelector((state) => state.telemetry.view_mode);
  const activeViewMode = propViewMode || storeViewMode || "aerial";
  const isGround = activeViewMode === "ground";
  const activeSourceType = useAppSelector((state) => state.telemetry.source_type) || "synthetic";
  const { switchSource } = useStreamMutation();

  const handleReconnectGround = async () => {
    await switchSource.mutateAsync({
      sourceType: activeSourceType,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <TuningPanel />
      <div className="flex flex-col gap-4">
        <TelemetryCards viewMode={activeViewMode} />
        {isGround ? (
          <PerimeterCameraCard
            onOpenWall={onOpenWall || onOpenFlightDeck}
            onReconnectStream={handleReconnectGround}
          />
        ) : (
          <DroneAvionicsCard
            avionics={avionics}
            onOpenFlightDeck={onOpenFlightDeck}
            onConnectAirLink={onConnectAirLink}
          />
        )}
      </div>
    </div>
  );
};

export default CalibrationView;
