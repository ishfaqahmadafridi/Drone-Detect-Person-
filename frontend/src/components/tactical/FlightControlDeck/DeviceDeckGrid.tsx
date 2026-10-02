"use client";

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
    <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 border-b border-slate-800/80 pb-4 select-none">
      {/* Row 1 */}
      <div>
        <div className="text-xs text-slate-400 font-medium">
          {isGround ? "Mount Height" : "Altitude"}
        </div>
        <div className="text-sm font-mono-code font-bold text-slate-100 mt-0.5">
          {isGround ? "2.8 m Fixed" : `${Math.round(altitude || altitudeM || 124)} m`}
        </div>
      </div>

      <div>
        <div className="text-xs text-slate-400 font-medium">
          {isGround ? "Lens FOV" : "Ground speed"}
        </div>
        <div className="text-sm font-mono-code font-bold text-slate-100 mt-0.5">
          {isGround ? "110° Wide" : `${(groundSpeedMs ?? 8.4).toFixed(1)} m/s`}
        </div>
      </div>

      {/* Row 2 */}
      <div>
        <div className="text-xs text-slate-400 font-medium">
          {isGround ? "Orientation" : "Heading"}
        </div>
        <div className="text-sm font-mono-code font-bold text-slate-100 mt-0.5">
          {isGround ? "North Post 03" : `${Math.round(compassHeadingDeg ?? 274)}°`}
        </div>
      </div>

      <div>
        <div className="text-xs text-slate-400 font-medium">
          {isGround ? "PoE Power" : "GPS lock"}
        </div>
        <div className="text-sm font-mono-code font-bold text-slate-100 mt-0.5">
          {isGround ? "48.2V PoE+" : `${gpsSats ?? 12} satellites`}
        </div>
      </div>

      {/* Row 3 */}
      <div>
        <div className="text-xs text-slate-400 font-medium">
          {isGround ? "Tamper State" : "Battery"}
        </div>
        <div className="text-sm font-mono-code font-bold text-slate-100 mt-0.5">
          {isGround ? "Secure" : `${batteryPercent ?? 82}%`}
        </div>
      </div>

      <div>
        <div className="text-xs text-slate-400 font-medium">Link latency</div>
        <div className="text-sm font-mono-code font-bold text-slate-100 mt-0.5">
          {latencyMs} ms
        </div>
      </div>
    </div>
  );
};

export default DeviceDeckGrid;
