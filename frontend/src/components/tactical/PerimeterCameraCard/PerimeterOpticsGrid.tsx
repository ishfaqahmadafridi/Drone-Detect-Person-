"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterOpticsGridProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Eye, ShieldAlert, Sliders } from "lucide-react";

export const PerimeterOpticsGrid: React.FC<PerimeterOpticsGridProps> = ({
  mountHeight = CCTV_CAMERA_CONFIG.mountHeight,
  lens = CCTV_CAMERA_CONFIG.lens,
  tamperStatus = CCTV_CAMERA_CONFIG.tamperStatus,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {/* 1. Fixed Mount Height */}
      <div className={TACTICAL_VIEW_STYLES.PerimeterOpticsGrid_div_className}>
        <span className={TACTICAL_VIEW_STYLES.PerimeterOpticsGrid_span_className}>
          <Sliders className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Gauge_className} />
          Mount Height
        </span>
        <span className={TACTICAL_VIEW_STYLES.PerimeterOpticsGrid_span_className_2}>
          {mountHeight}
        </span>
      </div>

      {/* 2. Optical Field of View */}
      <div className={TACTICAL_VIEW_STYLES.PerimeterOpticsGrid_div_className}>
        <span className={TACTICAL_VIEW_STYLES.PerimeterOpticsGrid_span_className}>
          <Eye className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} />
          Optical Lens
        </span>
        <span className={TACTICAL_VIEW_STYLES.PerimeterOpticsGrid_span_className_3}>
          {lens}
        </span>
      </div>

      {/* 3. Anti-Tamper Sensor */}
      <div className={TACTICAL_VIEW_STYLES.PerimeterOpticsGrid_div_className}>
        <span className={TACTICAL_VIEW_STYLES.PerimeterOpticsGrid_span_className}>
          <ShieldAlert className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Satellite_className} />
          Anti-Tamper
        </span>
        <span className={TACTICAL_VIEW_STYLES.PerimeterOpticsGrid_span_className_4}>
          {tamperStatus.split(" ")[0]}
        </span>
      </div>
    </div>
  );
};

export default PerimeterOpticsGrid;
