"use client";

import React from "react";
import { RecordingsListPaneProps } from "@/types";
import { RecordingsHeader } from "./RecordingsHeader";
import { RecordingsFilterTabs } from "./RecordingsFilterTabs";
import { RecordingsListItem } from "./RecordingsListItem";
import { RecordingsEmptyState } from "./RecordingsEmptyState";

export const RecordingsListPane: React.FC<RecordingsListPaneProps> = ({
  snapshots,
  totalCount,
  filteredCount,
  isLoading,
  filterMode,
  selectedSnapshot,
  onSelectSnapshot,
  onFilterChange,
  onRefresh,
  isRecording,
  onToggleRecording,
  isActionLoading,
}) => {
  return (
    <div className="flex flex-col h-full gap-3 min-w-0">
      {/* 1. Header with Refresh & REC Toggle */}
      <RecordingsHeader
        totalCount={totalCount}
        filteredCount={filteredCount}
        isLoading={isLoading}
        onRefresh={onRefresh}
        isRecording={isRecording}
        onToggleRecording={onToggleRecording}
        isActionLoading={isActionLoading}
      />

      {/* 2. Perspective Filter Tabs (ALL / AERIAL / GROUND) */}
      <RecordingsFilterTabs
        activeFilter={filterMode}
        onFilterChange={onFilterChange}
      />

      {/* 3. Scrollable List of Records */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {isLoading || snapshots.length === 0 ? (
          <RecordingsEmptyState isLoading={isLoading} />
        ) : (
          snapshots.map((snap) => (
            <RecordingsListItem
              key={snap.filename}
              snap={snap}
              isSelected={selectedSnapshot?.filename === snap.filename}
              onSelect={() => onSelectSnapshot(snap)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecordingsListPane;
