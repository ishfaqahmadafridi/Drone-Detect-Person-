"use client";

import React from "react";
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
      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all group ${
        isSelected
          ? "bg-slate-800/90 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/40"
          : "bg-slate-900/60 hover:bg-slate-800/50 border-slate-800/80 hover:border-slate-700/80"
      }`}
    >
      {/* 1. Media Thumbnail */}
      <ListItemThumbnail url={snap.url} filename={snap.filename} />

      {/* 2. Metadata Column */}
      <div className="flex-1 min-w-0">
        <ListItemBadges viewMode={snap.view_mode} filename={snap.filename} />
        <ListItemTimestamp createdAt={snap.created_at} />
        <ListItemFooter sizeKb={snap.size_kb} filename={snap.filename} />
      </div>
    </button>
  );
};

export default RecordingsListItem;
export * from "./item";
