"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterPowerStatusProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Zap, CheckCircle2 } from "lucide-react";

export const PerimeterPowerStatus: React.FC<PerimeterPowerStatusProps> = ({
  powerSource = CCTV_CAMERA_CONFIG.powerSource,
  powerStatus = CCTV_CAMERA_CONFIG.powerStatus,
  voltage = CCTV_CAMERA_CONFIG.voltage,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_div_className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_div_className_2}>
            <Zap className={TACTICAL_VIEW_STYLES.MobileGroundCardHeader_Smartphone_className} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_span_className}>
                PoE 48V
              </span>
              <span className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_span_className_2}>
                ({voltage})
              </span>
            </div>
            <div className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_div_className_3}>
              <span>Supply:</span>
              <span className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_span_className_3}>
                <CheckCircle2 className="w-2.5 h-2.5" /> MAINS 24/7
              </span>
              <span className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_span_className_4}>•</span>
              <span>Load:</span>
              <span className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_span_className_5}>12.4W</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_div_className_4}>
            <div
              className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_div_className_5}
              style={{ width: "100%" }}
            />
          </div>
          <span className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_span_className_6}>
            {powerStatus}
          </span>
        </div>
      </div>
      <div className={TACTICAL_VIEW_STYLES.PerimeterPowerStatus_div_className_6}>
        Infrastructure: {powerSource}
      </div>
    </div>
  );
};

export default PerimeterPowerStatus;
