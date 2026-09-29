"use client";

import React from "react";
import { TacticalViewRouterProps } from "@/types";
import { AirspaceCommandView } from "./AirspaceCommandView";
import { IncidentAuditView } from "./IncidentAuditView";
import { CalibrationView } from "./CalibrationView";
import { RecordingsView } from "./RecordingsView";

export const TacticalViewRouter: React.FC<TacticalViewRouterProps> = ({
  activeTab,
  onSnapshotTrigger,
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
  onConnectAirLink,
  onOpenFlightDeck,
  avionics,
}) => {
  switch (activeTab) {
    case "incidents":
      return <IncidentAuditView />;
    case "recordings":
      return <RecordingsView />;
    case "settings":
      return (
        <CalibrationView
          avionics={avionics}
          onOpenFlightDeck={onOpenFlightDeck}
          onConnectAirLink={onConnectAirLink}
        />
      );
    case "airspace":
    case "avionics":
    case "geofence":
    default:
      return (
        <AirspaceCommandView
          onSnapshotTrigger={onSnapshotTrigger}
          flightState={flightState}
          altitude={altitude}
          batteryPercent={batteryPercent}
          isCommandPending={isCommandPending}
          onCommand={onCommand}
          onConnectAirLink={onConnectAirLink}
          onOpenFlightDeck={onOpenFlightDeck}
          avionics={avionics}
        />
      );
  }
};
