"use client";

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
          ? "bg-slate-800/90 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/40"
          : "bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80 hover:border-cyan-500/40"
      }`}
    >
      {/* 1. Left: Thumbnail & Metadata */}
      <div className="flex items-center gap-3.5 min-w-0">
        <ListItemThumbnail url={snap.url} filename={snap.filename} />

        <div className="flex flex-col min-w-0 gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <ListItemBadges viewMode={snap.view_mode} filename={snap.filename} />
            <span className="font-mono-code text-xs text-slate-200 font-semibold truncate max-w-xs sm:max-w-md lg:max-w-lg">
              {snap.filename}
            </span>
          </div>
          <ListItemTimestamp createdAt={snap.created_at} />
        </div>
      </div>

      {/* 2. Right: Storage Size & Inspect Action */}
      <div className="flex items-center gap-4 shrink-0">
        <ListItemFooter sizeKb={snap.size_kb} filename={snap.filename} />
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:border-cyan-500/60 text-slate-300 group-hover:text-cyan-300 text-xs font-mono-code transition-all">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>INSPECT</span>
        </div>
      </div>
    </button>
  );
};

export default RecordingsListItem;
export * from "./item";
