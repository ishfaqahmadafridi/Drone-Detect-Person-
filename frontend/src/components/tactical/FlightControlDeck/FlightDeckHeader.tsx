"use client";

import React from "react";
import { FlightDeckHeaderProps } from "@/types";
import { Navigation } from "lucide-react";

export const FlightDeckHeader: React.FC<FlightDeckHeaderProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-cyan-400" />
        <h3 className="font-display font-bold text-sm tracking-wide text-white uppercase">
          MISSION FLIGHT CONTROL DECK
        </h3>
      </div>
      <span className="font-mono-code text-[10px] text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
        UAV COMMAND LINK
      </span>
    </div>
  );
};

export default FlightDeckHeader;
