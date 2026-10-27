"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Clock } from "lucide-react";
import { ListItemTimestampProps } from "@/types";
import { parseEvidenceTimestamp } from "@/utils";

export const ListItemTimestamp: React.FC<ListItemTimestampProps> = ({ createdAt }) => {
  const { datePart, timePart } = parseEvidenceTimestamp(createdAt);

  return (
    <div className={TACTICAL_VIEW_STYLES.ListItemTimestamp_div_className}>
      <Clock className={TACTICAL_VIEW_STYLES.ListItemTimestamp_Clock_className} />
      <span className={TACTICAL_VIEW_STYLES.ListItemTimestamp_span_className}>
        {timePart}
      </span>
      <span className={TACTICAL_VIEW_STYLES.PerimeterDeckHeader_p_className}>
        {datePart}
      </span>
    </div>
  );
};

export default ListItemTimestamp;
