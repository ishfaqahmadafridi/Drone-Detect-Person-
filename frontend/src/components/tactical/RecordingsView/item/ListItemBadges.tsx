"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { ListItemBadgesProps } from "@/types";
import { useEvidenceMetadata } from "@/hooks";

export const ListItemBadges: React.FC<ListItemBadgesProps> = ({ viewMode, filename }) => {
  const { perspectiveLabel, perspectiveBadgeClass, threatType, threatBadgeClass } =
    useEvidenceMetadata({ view_mode: viewMode, filename });

  const isVideo = filename.toLowerCase().endsWith(".mp4");

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Format Badge: VIDEO vs SNAPSHOT */}
      <span
        className={`px-1.5 py-0.5 rounded text-[8px] font-mono-code font-bold tracking-wider border ${
          isVideo
            ? TACTICAL_VIEW_STYLES.ListItemBadges_span_className
            : TACTICAL_VIEW_STYLES.ListItemBadges_span_className_2
        }`}
      >
        {isVideo ? "VIDEO (MP4)" : "SNAPSHOT (JPG)"}
      </span>

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
