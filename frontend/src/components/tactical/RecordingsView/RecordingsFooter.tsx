"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { AlertTriangle } from "lucide-react";
import { RecordingsFooterProps } from "@/types";

export const RecordingsFooter: React.FC<RecordingsFooterProps> = ({ totalCount }) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.RecordingsFooter_div_className}>
      <AlertTriangle className={TACTICAL_VIEW_STYLES.RecordingsFooter_AlertTriangle_className} />
      <span>
        Records are auto-saved on INTRUSION or GATHERING threat events.
        Timestamps are in local system time. Total stored:{" "}
        <span className={TACTICAL_VIEW_STYLES.RecordingsFooter_span_className}>{totalCount}</span> frame
        {totalCount !== 1 ? "s" : ""}.
      </span>
    </div>
  );
};

export default RecordingsFooter;
