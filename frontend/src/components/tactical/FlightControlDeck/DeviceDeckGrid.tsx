"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { DeviceDeckGridProps } from "@/types";

export const DeviceDeckGrid: React.FC<DeviceDeckGridProps> = ({
  altitude,
  altitudeM,
  groundSpeedMs,
  compassHeadingDeg,
  gpsSats,
  batteryPercent,
  latencyMs = 48,
  viewMode = "aerial",
}) => {
  const isGround = viewMode === "ground";

  return (
    <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className}>
      {/* Row 1 */}
      <div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_2}>
          {isGround ? "Mount Height" : "Altitude"}
        </div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_3}>
          {isGround ? "2.8 m Fixed" : `${Math.round(altitude || altitudeM || 124)} m`}
        </div>
      </div>

      <div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_2}>
          {isGround ? "Lens FOV" : "Ground speed"}
        </div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_3}>
          {isGround ? "110° Wide" : `${(groundSpeedMs ?? 8.4).toFixed(1)} m/s`}
        </div>
      </div>

      {/* Row 2 */}
      <div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_2}>
          {isGround ? "Orientation" : "Heading"}
        </div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_3}>
          {isGround ? "North Post 03" : `${Math.round(compassHeadingDeg ?? 274)}°`}
        </div>
      </div>

      <div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_2}>
          {isGround ? "PoE Power" : "GPS lock"}
        </div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_3}>
          {isGround ? "48.2V PoE+" : `${gpsSats ?? 12} satellites`}
        </div>
      </div>

      {/* Row 3 */}
      <div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_2}>
          {isGround ? "Tamper State" : "Battery"}
        </div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_3}>
          {isGround ? "Secure" : `${batteryPercent ?? 82}%`}
        </div>
      </div>

      <div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_2}>Link latency</div>
        <div className={TACTICAL_VIEW_STYLES.DeviceDeckGrid_div_className_3}>
          {latencyMs} ms
        </div>
      </div>
    </div>
  );
};

export default DeviceDeckGrid;
