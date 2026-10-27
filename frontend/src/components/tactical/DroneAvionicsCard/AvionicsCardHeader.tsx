"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { AvionicsCardHeaderProps } from "@/types";
import { getFlightStateColor } from "@/utils";

export const AvionicsCardHeader: React.FC<AvionicsCardHeaderProps> = ({ flightState }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={TACTICAL_VIEW_STYLES.AvionicsCardHeader_div_className}>
          <div className={TACTICAL_VIEW_STYLES.AvionicsCardHeader_div_className_2} />
        </div>
        <span className={TACTICAL_VIEW_STYLES.AvionicsCardHeader_span_className}>
          DRONE AVIONICS & BATTERY
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`font-mono-code text-[11px] px-2 py-0.5 rounded border uppercase font-semibold ${getFlightStateColor(
            flightState
          )}`}
        >
          {flightState}
        </span>
      </div>
    </div>
  );
};

export default AvionicsCardHeader;
