"use client";

import React from "react";
import { CameraCardLocationSpecsProps } from "@/types";
import { MapPin, Network, Video } from "lucide-react";

export const CardLocationSpecs: React.FC<CameraCardLocationSpecsProps> = ({
  channel,
}) => {
  return (
    <>
      {/* Prominent Location Field */}
      <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
        <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
            DEPLOYMENT LOCATION:
          </span>
          <span className="text-white font-bold text-xs truncate">
            {channel.location}
          </span>
        </div>
      </div>

      {/* Network & Optical Spec Grid */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Network className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{channel.ipAddress || "LAN IP"}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{channel.resolution || "1080p FHD"}</span>
        </div>
      </div>
    </>
  );
};

export default CardLocationSpecs;
