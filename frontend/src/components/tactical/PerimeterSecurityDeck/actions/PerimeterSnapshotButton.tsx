"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import { useSnapshotFeedback } from "@/hooks/useSnapshotFeedback";
import React from "react";
import { PerimeterSnapshotButtonProps } from "@/types";
import { Camera, Check } from "lucide-react";

export const PerimeterSnapshotButton: React.FC<PerimeterSnapshotButtonProps> = ({
  onSnapshot,
}) => {
  const { isCapturing, handleCapture } = useSnapshotFeedback(onSnapshot);

  return (
    <button
      onClick={handleCapture}
      disabled={isCapturing}
      className={TACTICAL_VIEW_STYLES.PerimeterSnapshotButton_button_className}
      title="Capture instant forensic audit snapshot"
    >
      {isCapturing ? (
        <>
          <Check className={TACTICAL_VIEW_STYLES.DroneBatteryPill_Battery_className} />
          <span className={TACTICAL_VIEW_STYLES.PerimeterSnapshotButton_span_className}>CAPTURED</span>
        </>
      ) : (
        <>
          <Camera className="w-3.5 h-3.5" />
          <span>CAPTURE EVIDENCE</span>
        </>
      )}
    </button>
  );
};

export default PerimeterSnapshotButton;
