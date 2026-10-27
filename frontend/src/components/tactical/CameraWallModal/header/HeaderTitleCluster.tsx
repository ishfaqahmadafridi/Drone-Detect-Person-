"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { HeaderTitleClusterProps } from "@/types";
import { Eye } from "lucide-react";

export const HeaderTitleCluster: React.FC<HeaderTitleClusterProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={TACTICAL_VIEW_STYLES.HeaderTitleCluster_div_className}>
        <Eye className="w-5 h-5" />
      </div>
      <div>
        <h2 className={TACTICAL_VIEW_STYLES.HeaderTitleCluster_h2_className}>
          TACTICAL MULTI-SENSOR CAMERA WALL
        </h2>
        <p className={TACTICAL_VIEW_STYLES.HeaderTitleCluster_p_className}>
          Connect multiple cameras or drone feeds to monitor simultaneous live coverage
        </p>
      </div>
    </div>
  );
};

export default HeaderTitleCluster;
