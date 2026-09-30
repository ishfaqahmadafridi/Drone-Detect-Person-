"use client";

import React from "react";
import { SensorTitleClusterProps } from "@/types";

export const SensorTitleCluster: React.FC<SensorTitleClusterProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
      <h2 className="font-display font-bold text-sm tracking-wider text-white uppercase">
        PRIMARY OPTICAL SENSOR
      </h2>
    </div>
  );
};
