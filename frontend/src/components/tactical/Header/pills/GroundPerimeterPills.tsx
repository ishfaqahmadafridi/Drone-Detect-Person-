"use client";

import React from "react";
import { GroundPerimeterPillsProps } from "@/types";
import { GroundSensorPill } from "./GroundSensorPill";
import { GroundPowerPill } from "./GroundPowerPill";

export const GroundPerimeterPills: React.FC<GroundPerimeterPillsProps> = ({
  className = "",
}) => {
  return (
    <div className={`hidden md:flex items-center gap-2 ${className}`}>
      {/* 1. CCTV Fixed Mount Status Pill */}
      <GroundSensorPill />

      {/* 2. Continuous PoE 48V Mains Power Supply Pill */}
      <GroundPowerPill />
    </div>
  );
};

export default GroundPerimeterPills;
