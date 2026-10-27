"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Radio } from "lucide-react";
import { ViewportStandbyLoaderProps } from "@/types";

export const ViewportStandbyLoader: React.FC<ViewportStandbyLoaderProps> = ({ isLoaded }) => {
  if (isLoaded) return null;

  return (
    <div className={TACTICAL_VIEW_STYLES.ViewportStandbyLoader_div_className}>
      <div className={TACTICAL_VIEW_STYLES.ViewportStandbyLoader_div_className_2}>
        <div className={TACTICAL_VIEW_STYLES.ViewportStandbyLoader_div_className_3} />
        <div className={TACTICAL_VIEW_STYLES.ViewportStandbyLoader_div_className_4} />
        <Radio className={TACTICAL_VIEW_STYLES.ViewportStandbyLoader_Radio_className} />
      </div>
      <div className="text-center font-mono-code">
        <div className={TACTICAL_VIEW_STYLES.ViewportStandbyLoader_div_className_5}>
          OPTICAL SENSOR ACTIVE
        </div>
        <div className={TACTICAL_VIEW_STYLES.ViewportStandbyLoader_div_className_6}>
          Synchronizing High-Speed MJPEG Telemetry...
        </div>
      </div>
    </div>
  );
};
