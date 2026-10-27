"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Clock, Camera, HardDrive } from "lucide-react";
import { RecordDetailPanelProps } from "@/types";
import { useEvidenceMetadata } from "@/hooks";

export const RecordDetailPanel: React.FC<RecordDetailPanelProps> = ({ snap }) => {
  const { datePart, timePart, perspectiveLabel, perspectiveBadgeClass: perspectiveColor } =
    useEvidenceMetadata(snap);

  return (
    <div className={TACTICAL_VIEW_STYLES.RecordDetailPanel_div_className}>
      {/* Full-size preview */}
      {snap.url && (
        <div className={TACTICAL_VIEW_STYLES.RecordDetailPanel_div_className_2}>
          <img
            src={snap.url}
            alt={snap.filename}
            className="w-full max-h-48 object-contain"
          />
        </div>
      )}

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code">
        <div className={TACTICAL_VIEW_STYLES.RecordDetailPanel_div_className_3}>
          <Clock className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Gauge_className} />
          <span className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className_3}>DATE</span>
          <span className={TACTICAL_VIEW_STYLES.RecordDetailPanel_span_className}>{datePart}</span>
        </div>
        <div className={TACTICAL_VIEW_STYLES.RecordDetailPanel_div_className_3}>
          <Clock className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Gauge_className} />
          <span className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className_3}>TIME</span>
          <span className={TACTICAL_VIEW_STYLES.RecordDetailPanel_span_className}>{timePart}</span>
        </div>
        <div className={TACTICAL_VIEW_STYLES.RecordDetailPanel_div_className_3}>
          <Camera className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} />
          <span className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className_3}>SENSOR</span>
          <span className={`ml-auto font-bold ${perspectiveColor.split(" ")[1] ?? TACTICAL_VIEW_STYLES.PerimeterPowerStatus_span_className_5}`}>
            {perspectiveLabel}
          </span>
        </div>
        <div className={TACTICAL_VIEW_STYLES.RecordDetailPanel_div_className_3}>
          <HardDrive className={TACTICAL_VIEW_STYLES.FlightStatePill_Navigation_className} />
          <span className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className_3}>SIZE</span>
          <span className={TACTICAL_VIEW_STYLES.RecordDetailPanel_span_className}>{snap.size_kb} KB</span>
        </div>
      </div>

      {/* Download / open link */}
      {snap.url && (
        <a
          href={snap.url}
          target="_blank"
          rel="noopener noreferrer"
          className={TACTICAL_VIEW_STYLES.RecordDetailPanel_a_className}
        >
          OPEN FULL FRAME ↗
        </a>
      )}
    </div>
  );
};

export default RecordDetailPanel;
