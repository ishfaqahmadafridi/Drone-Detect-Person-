"use client";

import React from "react";
import { CameraWallCardProps } from "@/types";
import { TacticalCameraFeedPreview } from "./TacticalCameraFeedPreview";
import { CardHeader } from "./CardHeader";
import { CardLocationSpecs } from "./CardLocationSpecs";
import { CardActions } from "./CardActions";

export const CameraWallCard: React.FC<CameraWallCardProps> = ({
  channel,
  isActive,
  isConnected,
  onToggleConnect,
  onSelect,
}) => {
  return (
    <div
      onClick={onToggleConnect}
      className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${
        isActive
          ? "border-blue-500 bg-blue-950/20 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
          : isConnected
          ? "border-emerald-500/80 bg-emerald-950/15 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          : "border-slate-700/60 bg-[#06080E]/70 hover:border-blue-500/60 hover:bg-slate-900/50"
      }`}
    >
      {/* 1. Channel Header & Identity Strip */}
      <CardHeader
        channel={channel}
        isActive={isActive}
        isConnected={isConnected}
      />

      {/* 2. Live Surveillance Coverage Feed Preview Window */}
      <div className="p-3 pb-1">
        <TacticalCameraFeedPreview
          channel={channel}
          isActive={isActive}
          onSelect={onSelect}
        />
      </div>

      {/* 3. Channel Telemetry & Action Strip */}
      <div className="p-4 pt-2 flex flex-col gap-2.5 text-left text-xs font-mono-code flex-1 justify-between">
        <CardLocationSpecs channel={channel} />

        <CardActions
          isActive={isActive}
          isConnected={isConnected}
          onSelect={onSelect}
          onToggleConnect={onToggleConnect}
        />
      </div>
    </div>
  );
};

export default CameraWallCard;
