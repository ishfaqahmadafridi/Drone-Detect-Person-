"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { GroundPowerPillProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Zap } from "lucide-react";

export const GroundPowerPill: React.FC<GroundPowerPillProps> = ({
  powerSource = CCTV_CAMERA_CONFIG.powerSource,
  powerStatus = CCTV_CAMERA_CONFIG.powerStatus,
}) => {
  return (
    <div
      className={TACTICAL_VIEW_STYLES.GroundPowerPill_div_className}
      title={`Power: ${powerSource} • Status: ${powerStatus}`}
    >
      <Zap className={TACTICAL_VIEW_STYLES.GroundStep3Form_Network_className} />
      <span>PoE 48V (Online)</span>
    </div>
  );
};

export default GroundPowerPill;
