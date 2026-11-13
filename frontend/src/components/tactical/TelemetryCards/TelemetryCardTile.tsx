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
  const className = `${TACTICAL_VIEW_STYLES.TelemetryCardTile_div_className}${
    onClick ? TACTICAL_VIEW_STYLES.TelemetryCardTile_interactive_className : ""
  }${isAlert ? TACTICAL_VIEW_STYLES.TelemetryCardTile_div_className_2 : TACTICAL_VIEW_STYLES.TelemetryCardTile_div_className_3}`;
  const body = (
    <>
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
        {onClick && <ArrowUpRight aria-hidden="true" className={TACTICAL_VIEW_STYLES.TelemetryCardTile_ArrowUpRight_className} />}
      </div>
    </>
  );
  // Only cards that open something are buttons (and show the arrow); the rest are plain readouts.
  return onClick
    ? <button type="button" onClick={onClick} className={className}>{body}</button>
    : <div className={className}>{body}</div>;
};

export default TelemetryCardTile;
