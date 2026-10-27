"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterDeckHeaderProps } from "@/types";
import { ShieldCheck, Eye } from "lucide-react";

export const PerimeterDeckHeader: React.FC<PerimeterDeckHeaderProps> = ({
  className = "",
}) => {
  return (
    <div className={`${TACTICAL_VIEW_STYLES.PerimeterDeckHeader_div_className}${className}`}>
      <div className="flex items-center gap-2">
        <div className={TACTICAL_VIEW_STYLES.PerimeterDeckHeader_div_className_2}>
          <ShieldCheck className={TACTICAL_VIEW_STYLES.PerimeterCardHeader_Video_className} />
        </div>
        <div>
          <h2 className={TACTICAL_VIEW_STYLES.PerimeterDeckHeader_h2_className}>
            PERIMETER CCTV CONTROL DECK
          </h2>
          <p className={TACTICAL_VIEW_STYLES.PerimeterDeckHeader_p_className}>
            Ground Security Optical & Tactical Directives
          </p>
        </div>
      </div>

      <div className={TACTICAL_VIEW_STYLES.PerimeterDeckHeader_div_className_3}>
        <Eye className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} />
        <span>FIXED SURVEILLANCE</span>
      </div>
    </div>
  );
};

export default PerimeterDeckHeader;
