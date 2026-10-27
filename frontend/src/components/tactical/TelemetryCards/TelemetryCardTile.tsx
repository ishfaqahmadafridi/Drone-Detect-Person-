"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { TelemetryCardTileProps } from "@/types";
import { ArrowUpRight } from "lucide-react";

export const TelemetryCardTile: React.FC<TelemetryCardTileProps> = ({
  title,
  value,
  subText,
  isAlert = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${TACTICAL_VIEW_STYLES.TelemetryCardTile_div_className}${
        isAlert
          ? TACTICAL_VIEW_STYLES.TelemetryCardTile_div_className_2
          : TACTICAL_VIEW_STYLES.TelemetryCardTile_div_className_3
      }`}
    >
      <div>
        <div className={TACTICAL_VIEW_STYLES.TelemetryCardTile_div_className_4}>
          {title}
        </div>
        <div className={TACTICAL_VIEW_STYLES.TelemetryCardTile_div_className_5}>
          {value}
        </div>
      </div>

      <div className={TACTICAL_VIEW_STYLES.TelemetryCardTile_div_className_6}>
        <span>{subText}</span>
        <ArrowUpRight className={TACTICAL_VIEW_STYLES.TelemetryCardTile_ArrowUpRight_className} />
      </div>
    </div>
  );
};

export default TelemetryCardTile;
