"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { FlightPhysicsGridProps } from "@/types";
import { Gauge, Compass, Satellite } from "lucide-react";

export const FlightPhysicsGrid: React.FC<FlightPhysicsGridProps> = ({ altitude, speed, sats }) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_div_className}>
        <div className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_div_className_2}>
          <Gauge className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Gauge_className} />
          <span>ALTITUDE</span>
        </div>
        <div className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_div_className_3}>
          {altitude.toFixed(1)}m
        </div>
      </div>

      <div className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_div_className}>
        <div className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_div_className_2}>
          <Compass className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} />
          <span>SPEED</span>
        </div>
        <div className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_div_className_4}>
          {speed.toFixed(1)} m/s
        </div>
      </div>

      <div className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_div_className}>
        <div className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_div_className_2}>
          <Satellite className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Satellite_className} />
          <span>GPS SATS</span>
        </div>
        <div className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_div_className_5}>
          {sats} (3D FIX)
        </div>
      </div>
    </div>
  );
};

export default FlightPhysicsGrid;
