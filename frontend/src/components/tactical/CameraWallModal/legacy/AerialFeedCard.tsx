"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { AerialFeedCardProps } from "@/types";
import { CheckCircle2 } from "lucide-react";
import { getVideoStreamUrl } from "@/constants/network";
import { useVideoStreamUrl } from "@/hooks/useVideoStreamUrl";

export const AerialFeedCard: React.FC<AerialFeedCardProps> = ({ isActive, onSelect }) => {
  const streamUrl = useVideoStreamUrl(getVideoStreamUrl());
  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 ${
        isActive
          ? TACTICAL_VIEW_STYLES.CameraWallCard_div_className
          : TACTICAL_VIEW_STYLES.AerialFeedCard_div_className
      }`}
    >
      <div className={TACTICAL_VIEW_STYLES.AerialFeedCard_div_className_2}>
        <div className="flex items-center gap-2">
          <span className={TACTICAL_VIEW_STYLES.HeaderConnectionBadge_span_className} />
          <span className={TACTICAL_VIEW_STYLES.AerialFeedCard_span_className}>
            CH-01: AERIAL DRONE GIMBAL
          </span>
        </div>
        {isActive && (
          <span className={TACTICAL_VIEW_STYLES.AerialFeedCard_span_className_2}>
            <CheckCircle2 className="w-3 h-3" /> ACTIVE VIEWPORT
          </span>
        )}
      </div>

      <div className={TACTICAL_VIEW_STYLES.AerialFeedCard_div_className_3}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={streamUrl}
          alt="Aerial Drone Feed"
          className="w-full h-full object-contain pointer-events-none"
        />
        <div className={TACTICAL_VIEW_STYLES.AerialFeedCard_div_className_4}>
          AI DETECT: ACTIVE • 1080p @ 25FPS
        </div>
      </div>
    </div>
  );
};

export default AerialFeedCard;
