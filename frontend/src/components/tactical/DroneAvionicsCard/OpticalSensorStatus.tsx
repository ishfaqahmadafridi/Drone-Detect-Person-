"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { OpticalSensorStatusProps } from "@/types";
import { Video } from "lucide-react";

export const OpticalSensorStatus: React.FC<OpticalSensorStatusProps> = ({
  camOnline,
  camDetecting,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.OpticalSensorStatus_div_className}>
      <div className="flex items-center gap-2">
        <Video className={`w-4 h-4 ${camOnline ? TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className_2 : TACTICAL_VIEW_STYLES.OpticalSensorStatus_Video_className}`} />
        <span className={TACTICAL_VIEW_STYLES.OpticalSensorStatus_span_className}>
          OPTICAL SENSOR: <strong className={TACTICAL_VIEW_STYLES.OpticalSensorStatus_strong_className}>{camOnline ? "ONLINE (1080p)" : "DISCONNECTED"}</strong>
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            camDetecting ? TACTICAL_VIEW_STYLES.OpticalSensorStatus_span_className_2 : TACTICAL_VIEW_STYLES.OpticalSensorStatus_span_className_3
          }`}
        />
        <span className={TACTICAL_VIEW_STYLES.OpticalSensorStatus_span_className_4}>
          {camDetecting ? "PERSON DETECT: ACTIVE" : "STANDBY"}
        </span>
      </div>
    </div>
  );
};

export default OpticalSensorStatus;
