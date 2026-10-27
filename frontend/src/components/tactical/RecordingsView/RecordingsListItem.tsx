"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Play } from "lucide-react";
import { RecordingsListItemProps } from "@/types";
import {
  ListItemThumbnail,
  ListItemBadges,
  ListItemTimestamp,
  ListItemFooter,
} from "./item";

export const RecordingsListItem: React.FC<RecordingsListItemProps> = ({
  snap,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between gap-4 p-3 rounded-xl border text-left transition-all group ${
        isSelected
          ? TACTICAL_VIEW_STYLES.RecordingsListItem_button_className
          : TACTICAL_VIEW_STYLES.RecordingsListItem_button_className_2
      }`}
    >
      {/* 1. Left: Thumbnail & Metadata */}
      <div className="flex items-center gap-3.5 min-w-0">
        <ListItemThumbnail url={snap.url} filename={snap.filename} />

        <div className="flex flex-col min-w-0 gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <ListItemBadges viewMode={snap.view_mode} filename={snap.filename} />
            <span className={TACTICAL_VIEW_STYLES.RecordingsListItem_span_className}>
              {snap.filename}
            </span>
          </div>
          <ListItemTimestamp createdAt={snap.created_at} />
        </div>
      </div>

      {/* 2. Right: Storage Size & Inspect Action */}
      <div className="flex items-center gap-4 shrink-0">
        <ListItemFooter sizeKb={snap.size_kb} filename={snap.filename} />
        <div className={TACTICAL_VIEW_STYLES.RecordingsListItem_div_className}>
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>INSPECT</span>
        </div>
      </div>
    </button>
  );
};

export default RecordingsListItem;
export * from "./item";
