"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Film } from "lucide-react";
import { EmptyPreviewStateProps } from "@/types";

export const EmptyPreviewState: React.FC<EmptyPreviewStateProps> = ({ className = "" }) => {
  return (
    <div
      className={`${TACTICAL_VIEW_STYLES.EmptyPreviewState_div_className}${className}`}
    >
      <div className={TACTICAL_VIEW_STYLES.EmptyPreviewState_div_className_2}>
        <Film className={TACTICAL_VIEW_STYLES.EmptyPreviewState_Film_className} />
      </div>
      <h3 className={TACTICAL_VIEW_STYLES.EmptyPreviewState_h3_className}>
        No Recording Selected
      </h3>
      <p className={TACTICAL_VIEW_STYLES.EmptyPreviewState_p_className}>
        Select an aerial or ground evidence record from the list on the left to inspect high-resolution frame data and threat telemetry.
      </p>
    </div>
  );
};

export default EmptyPreviewState;
