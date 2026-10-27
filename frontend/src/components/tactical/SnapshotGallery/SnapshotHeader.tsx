"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Image as ImageIcon, RotateCw } from "lucide-react";
import { SnapshotHeaderProps } from "@/types";

export const SnapshotHeader: React.FC<SnapshotHeaderProps> = ({
  count,
  isLoading,
  onRefresh,
  filterMode = "all",
  onFilterChange,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.IncidentHeader_div_className}>
      <div className="flex items-center gap-2">
        <ImageIcon className={TACTICAL_VIEW_STYLES.FlightDeckHeader_Navigation_className} />
        <h3 className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className}>
          EVIDENTIARY SNAPSHOTS & INCIDENT FRAMES
        </h3>
        <span className={TACTICAL_VIEW_STYLES.SnapshotHeader_span_className}>
          {count} Captures
        </span>
      </div>

      <div className="flex items-center gap-3">
        {onFilterChange && (
          <div className={TACTICAL_VIEW_STYLES.SnapshotHeader_div_className}>
            <button
              onClick={() => onFilterChange("all")}
              className={`px-2 py-0.5 uppercase transition-colors ${
                filterMode === "all"
                  ? TACTICAL_VIEW_STYLES.SnapshotHeader_button_className
                  : TACTICAL_VIEW_STYLES.SnapshotHeader_button_className_2
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => onFilterChange("aerial")}
              className={`${TACTICAL_VIEW_STYLES.SnapshotHeader_button_className_3}${
                filterMode === "aerial"
                  ? TACTICAL_VIEW_STYLES.SnapshotHeader_button_className_4
                  : TACTICAL_VIEW_STYLES.SnapshotHeader_button_className_2
              }`}
            >
              AERIAL
            </button>
            <button
              onClick={() => onFilterChange("ground")}
              className={`${TACTICAL_VIEW_STYLES.SnapshotHeader_button_className_3}${
                filterMode === "ground"
                  ? TACTICAL_VIEW_STYLES.SnapshotHeader_button_className_5
                  : TACTICAL_VIEW_STYLES.SnapshotHeader_button_className_2
              }`}
            >
              GROUND
            </button>
          </div>
        )}

        <button
          onClick={onRefresh}
          className={TACTICAL_VIEW_STYLES.SnapshotHeader_button_className_6}
          title="Refresh captured frames"
        >
          <RotateCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
    </div>
  );
};
