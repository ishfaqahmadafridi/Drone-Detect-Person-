"use client";
import React from "react";
import { Images, RefreshCw } from "lucide-react";
import { EVIDENCE_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { SnapshotHeaderProps } from "@/types";
import { EvidenceSectionHeader } from "../IncidentLogs/EvidenceSectionHeader";

export const SnapshotHeader: React.FC<SnapshotHeaderProps> = ({
  count, description, isLoading, onRefresh, filterMode = "all", onFilterChange,
}) => (
  <EvidenceSectionHeader icon={Images} title="Evidence snapshots" count={count} description={description}>
    {onFilterChange && (
      <div role="group" aria-label="Filter by perspective" className={VIDEO_TOOLS.segmentedClass}>
        {EVIDENCE_UI.filters.map(filter => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={filterMode === filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={filterMode === filter.value ? VIDEO_TOOLS.segmentClass.active : VIDEO_TOOLS.segmentClass.idle}
          >
            {filter.label}
          </button>
        ))}
      </div>
    )}
    <button type="button" onClick={onRefresh} disabled={isLoading} className={VIDEO_TOOLS.secondaryButtonClass}>
      <RefreshCw aria-hidden="true" className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />Refresh
    </button>
  </EvidenceSectionHeader>
);
