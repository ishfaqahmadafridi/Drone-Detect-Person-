"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Camera, ShieldAlert, HardDrive } from "lucide-react";
import { ModalFooterProps } from "@/types";
import { getPerspectiveLabel, parseThreatType } from "@/utils";

export const ModalFooter: React.FC<ModalFooterProps> = ({ snapshot, onClose }) => {
  const perspectiveLabel = getPerspectiveLabel(snapshot.view_mode);
  const threatType = parseThreatType(snapshot.filename);

  return (
    <div className={TACTICAL_VIEW_STYLES.ModalFooter_div_className}>
      <div className="flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Camera className={TACTICAL_VIEW_STYLES.DroneBatteryPill_Battery_className} />
          SENSOR: <strong className={TACTICAL_VIEW_STYLES.ModalFooter_strong_className}>{perspectiveLabel}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldAlert className={TACTICAL_VIEW_STYLES.ModalFooter_ShieldAlert_className} />
          EVENT: <strong className={TACTICAL_VIEW_STYLES.ModalFooter_strong_className_2}>{threatType}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <HardDrive className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_ArrowRight_className} />
          SIZE: <strong className={TACTICAL_VIEW_STYLES.ModalFooter_strong_className}>{snapshot.size_kb} KB</strong>
        </span>
      </div>

      <button
        onClick={onClose}
        className={TACTICAL_VIEW_STYLES.ModalFooter_button_className}
      >
        CLOSE (ESC)
      </button>
    </div>
  );
};

export default ModalFooter;
