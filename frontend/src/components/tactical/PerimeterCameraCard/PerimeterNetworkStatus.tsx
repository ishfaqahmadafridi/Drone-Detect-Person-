"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterNetworkStatusProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Network, Activity } from "lucide-react";

export const PerimeterNetworkStatus: React.FC<PerimeterNetworkStatusProps> = ({
  networkProtocol = CCTV_CAMERA_CONFIG.networkProtocol,
  resolution = CCTV_CAMERA_CONFIG.resolution,
  isDetecting = true,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_div_className}>
      <div
        className="flex items-center gap-2"
        title={`Protocol: ${networkProtocol}`}
      >
        <Network className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_Network_className} />
        <span className={TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className_3}>STREAM LINK:</span>
        <span className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className}>
          <span className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className_2} />
          ONLINE ({resolution.split(" ")[0]})
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Activity className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_Network_className} />
        <span className={TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className_3}>CV AI:</span>
        <span
          className={`font-bold ${
            isDetecting ? TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className : TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className_3
          }`}
        >
          {isDetecting ? "ACTIVE" : "STANDBY"}
        </span>
      </div>
    </div>
  );
};

export default PerimeterNetworkStatus;
