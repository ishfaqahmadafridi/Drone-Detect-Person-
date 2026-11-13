"use client";
import { STATUS_ICON, TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { BrandClusterProps } from "@/types";
import { Shield, Wifi, WifiOff } from "lucide-react";

export const BrandCluster: React.FC<BrandClusterProps> = ({ isConnected }) => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={TACTICAL_VIEW_STYLES.BrandCluster_div_className}>
        <Shield className={TACTICAL_VIEW_STYLES.BrandCluster_Shield_className} />
      </div>
      <div className="flex items-center gap-2">
        <span className={TACTICAL_VIEW_STYLES.BrandCluster_span_className}>
          AERO-GUARD
        </span>
        {isConnected ? (
          <Wifi aria-label="Telemetry connected" className={`${STATUS_ICON.base} ${STATUS_ICON.ok}`} />
        ) : (
          <WifiOff aria-label="Connecting to telemetry" className={`${STATUS_ICON.base} ${STATUS_ICON.warn}`} />
        )}
      </div>
    </div>
  );
};

export default BrandCluster;
