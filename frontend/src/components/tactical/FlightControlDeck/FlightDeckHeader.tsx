"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { FlightDeckHeaderProps } from "@/types";
import { Navigation } from "lucide-react";

export const FlightDeckHeader: React.FC<FlightDeckHeaderProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <Navigation className={TACTICAL_VIEW_STYLES.FlightDeckHeader_Navigation_className} />
        <h3 className={TACTICAL_VIEW_STYLES.AvionicsCardHeader_span_className}>
          MISSION FLIGHT CONTROL DECK
        </h3>
      </div>
      <span className={TACTICAL_VIEW_STYLES.FlightDeckHeader_span_className}>
        UAV COMMAND LINK
      </span>
    </div>
  );
};

export default FlightDeckHeader;
