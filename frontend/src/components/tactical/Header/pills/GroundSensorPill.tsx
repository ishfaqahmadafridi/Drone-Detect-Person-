"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { GroundSensorPillProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Camera } from "lucide-react";

export const GroundSensorPill: React.FC<GroundSensorPillProps> = ({
  sensorId = CCTV_CAMERA_CONFIG.id,
  name = CCTV_CAMERA_CONFIG.name,
  mountHeight = CCTV_CAMERA_CONFIG.mountHeight,
}) => {
  return (
    <div
      className={TACTICAL_VIEW_STYLES.GroundPowerPill_div_className}
      title={`Sensor: ${name} • Mount: ${mountHeight}`}
    >
      <Camera className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} />
      <span>{sensorId} • Fixed</span>
    </div>
  );
};

export default GroundSensorPill;
