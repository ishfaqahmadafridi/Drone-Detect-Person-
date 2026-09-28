"use client";

import React from "react";
import { CalibrationViewProps } from "@/types";
import { TuningPanel } from "../TuningPanel";
import { TelemetryCards } from "../TelemetryCards";
import { DroneAvionicsCard } from "../DroneAvionicsCard";

export const CalibrationView: React.FC<CalibrationViewProps> = ({
  avionics,
  onOpenFlightDeck,
  onConnectAirLink,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <TuningPanel />
      <div className="flex flex-col gap-4">
        <TelemetryCards />
        <DroneAvionicsCard
          avionics={avionics}
          onOpenFlightDeck={onOpenFlightDeck}
          onConnectAirLink={onConnectAirLink}
        />
      </div>
    </div>
  );
};

export default CalibrationView;
