"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { AlertCircle, Download, RefreshCw } from "lucide-react";
import { IncidentHeaderProps } from "@/types";

export const IncidentHeader: React.FC<IncidentHeaderProps> = ({
  count,
  isLoading,
  onRefresh,
  onExport,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.IncidentHeader_div_className}>
      <div className="flex items-center gap-2">
        <AlertCircle className={TACTICAL_VIEW_STYLES.FlightDeckHeader_Navigation_className} />
        <h3 className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className}>
          INCIDENT AUDIT LOG
        </h3>
        <span className={TACTICAL_VIEW_STYLES.IncidentHeader_span_className}>
          {count} Events
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className={TACTICAL_VIEW_STYLES.IncidentHeader_button_className}
          title="Refresh incident logs"
          aria-label="Refresh incident logs"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? TACTICAL_VIEW_STYLES.IncidentHeader_RefreshCw_className : ""}`} />
        </button>
        <button
          onClick={onExport}
          className={TACTICAL_VIEW_STYLES.IncidentHeader_button_className_2}
          title="Export incident report as CSV"
        >
          <Download className="w-3 h-3" /> Export CSV
        </button>
      </div>
    </div>
  );
};
