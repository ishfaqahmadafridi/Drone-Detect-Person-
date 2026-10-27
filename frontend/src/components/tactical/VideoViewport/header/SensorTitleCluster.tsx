"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SensorTitleClusterProps } from "@/types";
import { useActiveCamera } from "@/hooks";
import { MapPin } from "lucide-react";

export const SensorTitleCluster: React.FC<SensorTitleClusterProps> = ({ className = "" }) => {
  const { camId, camName, camLoc } = useActiveCamera();

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className={TACTICAL_VIEW_STYLES.SensorTitleCluster_span_className} />
      <div className="flex items-center gap-2">
        <h2 className={TACTICAL_VIEW_STYLES.SensorTitleCluster_h2_className}>
          {camId}: {camName}
        </h2>
        <span className={TACTICAL_VIEW_STYLES.SensorTitleCluster_span_className_2}>
          <MapPin className={TACTICAL_VIEW_STYLES.GroundStep1Device_ShieldCheck_className} />
          <span>{camLoc}</span>
        </span>
      </div>
    </div>
  );
};
