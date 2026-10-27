"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { CameraCardLocationSpecsProps } from "@/types";
import { MapPin, Network, Video } from "lucide-react";

export const CardLocationSpecs: React.FC<CameraCardLocationSpecsProps> = ({
  channel,
}) => {
  return (
    <>
      {/* Prominent Location Field */}
      <div className={TACTICAL_VIEW_STYLES.CardLocationSpecs_div_className}>
        <MapPin className={TACTICAL_VIEW_STYLES.CardLocationSpecs_MapPin_className} />
        <div className="flex flex-col min-w-0">
          <span className={TACTICAL_VIEW_STYLES.CardLocationSpecs_span_className}>
            DEPLOYMENT LOCATION:
          </span>
          <span className={TACTICAL_VIEW_STYLES.CardLocationSpecs_span_className_2}>
            {channel.location}
          </span>
        </div>
      </div>

      {/* Network & Optical Spec Grid */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className={TACTICAL_VIEW_STYLES.CardLocationSpecs_div_className_2}>
          <Network className={TACTICAL_VIEW_STYLES.CardLocationSpecs_Network_className} />
          <span className="truncate">{channel.ipAddress || "LAN IP"}</span>
        </div>

        <div className={TACTICAL_VIEW_STYLES.CardLocationSpecs_div_className_2}>
          <Video className={TACTICAL_VIEW_STYLES.CardLocationSpecs_Network_className} />
          <span className="truncate">{channel.resolution || "1080p FHD"}</span>
        </div>
      </div>
    </>
  );
};

export default CardLocationSpecs;
