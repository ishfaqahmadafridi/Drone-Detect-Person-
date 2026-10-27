"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { BrandClusterProps } from "@/types";
import { Shield } from "lucide-react";

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
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isConnected ? TACTICAL_VIEW_STYLES.BrandCluster_span_className_2 : TACTICAL_VIEW_STYLES.BrandCluster_span_className_3
          }`}
          title={isConnected ? "Telemetry Connected" : "Connecting..."}
        />
      </div>
    </div>
  );
};

export default BrandCluster;
