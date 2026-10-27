"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterCardHeaderProps } from "@/types";
import { CCTV_CAMERA_CONFIG } from "@/constants/tactical";
import { Video, ShieldCheck } from "lucide-react";

export const PerimeterCardHeader: React.FC<PerimeterCardHeaderProps> = ({
  cameraId = CCTV_CAMERA_CONFIG.id,
  isOnline = true,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.PerimeterCardHeader_div_className}>
      <div className="flex items-center gap-2.5">
        <div className={TACTICAL_VIEW_STYLES.PerimeterCardHeader_div_className_2}>
          <Video className={TACTICAL_VIEW_STYLES.PerimeterCardHeader_Video_className} />
          <div className={TACTICAL_VIEW_STYLES.PerimeterCardHeader_div_className_3} />
        </div>
        <div>
          <h3 className={TACTICAL_VIEW_STYLES.PerimeterCardHeader_h3_className}>
            PERIMETER CCTV SENSOR
            <span className={TACTICAL_VIEW_STYLES.PerimeterCardHeader_span_className}>
              ({cameraId})
            </span>
          </h3>
          <p className={TACTICAL_VIEW_STYLES.PerimeterCardHeader_p_className}>
            {CCTV_CAMERA_CONFIG.location}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono-code font-bold tracking-wider uppercase border ${
            isOnline
              ? TACTICAL_VIEW_STYLES.PerimeterCardHeader_span_className_2
              : TACTICAL_VIEW_STYLES.PerimeterCardHeader_span_className_3
          }`}
        >
          <ShieldCheck className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} />
          <span>{isOnline ? "FIXED SECURE" : "OFFLINE"}</span>
        </span>
      </div>
    </div>
  );
};

export default PerimeterCardHeader;
