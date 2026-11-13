"use client";
import React from "react";
import { GROUND_SENSOR_SPECS, TACTICAL_VIEW_STYLES } from "@/constants/tactical";

/** Fixed perimeter-camera specs. Aerial flight data lives in the Tello panel, not here. */
export const DeviceDeckGrid: React.FC = () => (
  <dl className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className}>
    {GROUND_SENSOR_SPECS.map(spec => (
      <div key={spec.label}>
        <dt className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_2}>{spec.label}</dt>
        <dd className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_3}>{spec.value}</dd>
      </div>
    ))}
  </dl>
);

export default DeviceDeckGrid;
