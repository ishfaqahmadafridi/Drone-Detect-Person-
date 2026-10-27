"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterTelemetryBarProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Camera, MapPin, Radio, Shield } from "lucide-react";

export const PerimeterTelemetryBar: React.FC<PerimeterTelemetryBarProps> = ({
  cameraId = CCTV_CAMERA_CONFIG.id,
  mountHeight = CCTV_CAMERA_CONFIG.mountHeight,
  resolution = CCTV_CAMERA_CONFIG.resolution,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono-code">
      {/* 1. Camera Sensor ID */}
      <div className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_div_className}>
        <Camera className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_Network_className} />
        <div className="flex flex-col">
          <span className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_span_className}>Sensor ID</span>
          <span className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_span_className_2}>{cameraId}</span>
        </div>
      </div>

      {/* 2. Fixed Mount Elevation */}
      <div className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_div_className}>
        <MapPin className={TACTICAL_VIEW_STYLES.DroneBatteryPill_Battery_className} />
        <div className="flex flex-col">
          <span className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_span_className}>Mount Height</span>
          <span className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_span_className_3}>{mountHeight.split(" ")[0]}</span>
        </div>
      </div>

      {/* 3. Optical Stream Resolution */}
      <div className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_div_className}>
        <Radio className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_Network_className} />
        <div className="flex flex-col">
          <span className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_span_className}>Resolution</span>
          <span className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_span_className_4}>{resolution.split(" ")[0]}</span>
        </div>
      </div>

      {/* 4. Security State */}
      <div className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_div_className}>
        <Shield className={TACTICAL_VIEW_STYLES.DroneBatteryPill_Battery_className} />
        <div className="flex flex-col">
          <span className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_span_className}>Tamper Status</span>
          <span className={TACTICAL_VIEW_STYLES.PerimeterTelemetryBar_span_className_5}>SECURE</span>
        </div>
      </div>
    </div>
  );
};

export default PerimeterTelemetryBar;
