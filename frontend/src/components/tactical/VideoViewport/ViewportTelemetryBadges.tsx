"use client";

import React, { useState, useEffect } from "react";
import { ViewportTelemetryBadgesProps } from "@/types";
import { useTelemetryMetrics } from "@/hooks";

export const ViewportTelemetryBadges: React.FC<ViewportTelemetryBadgesProps> = ({
  fps,
}) => {
  const { totalPersons, gatheringPairs, threatLevel, viewMode } = useTelemetryMetrics();
  const [timeStr, setTimeStr] = useState<string>("15:24:06");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        [
          String(now.getUTCHours()).padStart(2, "0"),
          String(now.getUTCMinutes()).padStart(2, "0"),
          String(now.getUTCSeconds()).padStart(2, "0"),
        ].join(":")
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isGround = viewMode === "ground";
  const sensorTag = isGround
    ? "CAM 01 / GROUND-CCTV / NORTH PERIMETER"
    : "CAM 01 / UAV-01 / NORTH PERIMETER";

  const threatLabel = threatLevel === "INTRUSION"
    ? "INTRUSION DETECTED"
    : threatLevel === "MULTI_PERSON"
    ? "MULTI-PERSON CLUSTER"
    : "AIRSPACE NOMINAL";

  return (
    <>
      {/* 1. Top-Left OSD Sensor Identifier & Timestamp */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1 select-none">
        <div className="px-2.5 py-1 rounded bg-slate-950/85 backdrop-blur-md border border-slate-700/60 font-mono-code text-[11px] text-slate-200 font-semibold tracking-wider uppercase shadow-md">
          {sensorTag}
        </div>
        <div className="px-1 text-[11px] font-mono-code text-slate-300 tracking-wide">
          {timeStr} UTC
        </div>
      </div>

      {/* 2. Top-Right OSD Stream State Badge */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none select-none">
        <div className="px-3 py-1 rounded bg-slate-950/85 backdrop-blur-md border border-slate-700/60 font-mono-code text-[11px] text-slate-200 font-medium flex items-center gap-2 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SIMULATED • ONLINE</span>
        </div>
      </div>

      {/* 3. Bottom OSD Legend & Telemetry Status Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none flex flex-col gap-1.5 select-none">
        {/* Classification Legend */}
        <div className="self-start px-3 py-1 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-700/60 font-mono-code text-[11px] text-slate-300 flex items-center gap-3.5 shadow-md">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Safe</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Gathering</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Intrusion</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-cyan-400" />
            <span>Restricted zone</span>
          </span>
        </div>

        {/* Tactical Feed Summary */}
        <div className="px-1 text-[10px] font-mono-code tracking-wider text-slate-400 uppercase">
          SURVEILLANCE FEED &nbsp;|&nbsp; {threatLabel} &nbsp;•&nbsp; TRACKS: {String(totalPersons).padStart(2, "0")} &nbsp;•&nbsp; CLUSTERS: {String(gatheringPairs).padStart(2, "0")} &nbsp;•&nbsp; {(fps || 29.8).toFixed(1)} FPS
        </div>
      </div>
    </>
  );
};

export default ViewportTelemetryBadges;
