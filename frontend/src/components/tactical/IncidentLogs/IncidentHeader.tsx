"use client";
import React from "react";
import { ShieldAlert, Download, RefreshCw } from "lucide-react";
import { VIDEO_TOOLS } from "@/constants/tactical";
import { IncidentHeaderProps } from "@/types";
import { EvidenceSectionHeader } from "./EvidenceSectionHeader";

export const IncidentHeader: React.FC<IncidentHeaderProps> = ({ count, isLoading, onRefresh, onExport }) => (
  <EvidenceSectionHeader
    icon={ShieldAlert}
    title="Incidents"
    count={count}
    description="Restricted-zone intrusions, newest first."
  >
    <button type="button" onClick={onRefresh} disabled={isLoading} className={VIDEO_TOOLS.secondaryButtonClass}>
      <RefreshCw aria-hidden="true" className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />Refresh
    </button>
    <button type="button" onClick={onExport} disabled={count === 0} className={VIDEO_TOOLS.secondaryButtonClass}>
      <Download aria-hidden="true" className="h-4 w-4" />Export CSV
    </button>
  </EvidenceSectionHeader>
);
