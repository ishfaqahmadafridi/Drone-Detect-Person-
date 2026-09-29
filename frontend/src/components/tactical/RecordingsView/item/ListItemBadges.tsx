"use client";

import React from "react";
import { ListItemBadgesProps } from "@/types";
import {
  getPerspectiveLabel,
  getPerspectiveBadgeClass,
  parseThreatType,
  getThreatBadgeClass,
} from "@/utils";

export const ListItemBadges: React.FC<ListItemBadgesProps> = ({ viewMode, filename }) => {
  const perspectiveLabel = getPerspectiveLabel(viewMode);
  const perspectiveBadgeClass = getPerspectiveBadgeClass(viewMode);
  const threatType = parseThreatType(filename);
  const threatBadgeClass = getThreatBadgeClass(threatType);

  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-1">
      <span
        className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase tracking-wider border ${perspectiveBadgeClass}`}
      >
        {perspectiveLabel}
      </span>
      <span
        className={`px-1.5 py-0.5 rounded text-[8px] font-mono-code font-semibold tracking-wide border ${threatBadgeClass}`}
      >
        {threatType}
      </span>
    </div>
  );
};

export default ListItemBadges;
