"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Camera, Clock, ShieldAlert, HardDrive } from "lucide-react";
import { PreviewTelemetryAuditProps } from "@/types";
import { useEvidenceMetadata } from "@/hooks";

export const PreviewTelemetryAudit: React.FC<PreviewTelemetryAuditProps> = ({
  selectedSnapshot,
}) => {
  const { datePart, timePart, perspectiveLabel, threatType } =
    useEvidenceMetadata(selectedSnapshot);

  return (
    <div className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_div_className}>
      <div className="flex flex-col gap-0.5">
        <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className}>
          <Camera className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} /> SENSOR LINK
        </span>
        <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_2}>
          {perspectiveLabel === "AERIAL" ? "UAV DRONE (TOP-DOWN)" : "GROUND PERIMETER CCTV"}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className}>
          <Clock className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Gauge_className} /> CAPTURE TIME
        </span>
        <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_3}>
          {timePart} <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_4}>({datePart})</span>
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className}>
          <ShieldAlert className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_ShieldAlert_className} /> EVENT TRIGGER
        </span>
        <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_5}>
          {threatType}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className}>
          <HardDrive className={TACTICAL_VIEW_STYLES.FlightStatePill_Navigation_className} /> FILE SIZE
        </span>
        <span className={TACTICAL_VIEW_STYLES.RecordingsFooter_span_className}>
          {selectedSnapshot.size_kb} KB
        </span>
      </div>
    </div>
  );
};

export default PreviewTelemetryAudit;
