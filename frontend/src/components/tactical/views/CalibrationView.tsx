"use client";

import React from "react";
import { CalibrationViewProps } from "@/types";
import { useAppSelector } from "@/store";
import { TuningPanel } from "../TuningPanel";
import { TelemetryCards } from "../TelemetryCards";
import { DroneMovementPanel } from "../FlightControlDeck/manual/DroneMovementPanel";
import { PerimeterCameraCard } from "../PerimeterCameraCard";

import { useCalibrationView } from "@/hooks/useCalibrationView";

export const CalibrationView: React.FC<CalibrationViewProps> = ({
  viewMode: propViewMode,
  onOpenWall,
}) => {
  const storeViewMode = useAppSelector((state) => state.telemetry.view_mode);
  const activeViewMode = propViewMode || storeViewMode || "aerial";
  const isGround = activeViewMode === "ground";
  const { reconnectGround } = useCalibrationView();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <TuningPanel />
      <div className="flex flex-col gap-4">
        <TelemetryCards viewMode={activeViewMode} />
        {isGround ? (
          <PerimeterCameraCard
            onOpenWall={onOpenWall}
            onReconnectStream={reconnectGround}
          />
        ) : (
          <DroneMovementPanel />
        )}
      </div>
    </div>
  );
};

export default CalibrationView;
