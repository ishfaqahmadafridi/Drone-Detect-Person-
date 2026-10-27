"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Film, RefreshCw } from "lucide-react";
import { RecordingsEmptyStateProps } from "@/types";

export const RecordingsEmptyState: React.FC<RecordingsEmptyStateProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className={TACTICAL_VIEW_STYLES.RecordingsEmptyState_div_className}>
        <RefreshCw className={TACTICAL_VIEW_STYLES.RecordingsEmptyState_RefreshCw_className} />
        <span className="text-xs font-mono-code">LOADING RECORDS…</span>
      </div>
    );
  }

  return (
    <div className={TACTICAL_VIEW_STYLES.RecordingsEmptyState_div_className_2}>
      <Film className={TACTICAL_VIEW_STYLES.RecordingsEmptyState_Film_className} />
      <div className="text-center">
        <p className={TACTICAL_VIEW_STYLES.RecordingsEmptyState_p_className}>NO EVIDENCE RECORDS</p>
        <p className={TACTICAL_VIEW_STYLES.RecordingsEmptyState_p_className_2}>
          Frames are captured automatically when a threat is detected
        </p>
      </div>
    </div>
  );
};

export default RecordingsEmptyState;
