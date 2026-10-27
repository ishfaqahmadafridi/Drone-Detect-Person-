"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { MobileGroundCardHeaderProps } from "@/types";
import { Smartphone } from "lucide-react";

export const MobileGroundCardHeader: React.FC<MobileGroundCardHeaderProps> = ({ isActive }) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.AerialFeedCard_div_className_2}>
      <div className="flex items-center gap-2">
        <Smartphone className={TACTICAL_VIEW_STYLES.MobileGroundCardHeader_Smartphone_className} />
        <span className={TACTICAL_VIEW_STYLES.AerialFeedCard_span_className}>
          CH-02: GROUND CAMERA / PHONE SENSOR
        </span>
      </div>
      {isActive && (
        <span className={TACTICAL_VIEW_STYLES.MobileGroundCardHeader_span_className}>
          <span className={TACTICAL_VIEW_STYLES.MobileGroundCardHeader_span_className_2} />
          ACTIVE SENSOR
        </span>
      )}
    </div>
  );
};

export default MobileGroundCardHeader;
