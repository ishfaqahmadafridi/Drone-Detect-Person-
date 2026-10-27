"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { CameraCardHeaderProps } from "@/types";
import { CheckCircle2, Radio } from "lucide-react";

export const CardHeader: React.FC<CameraCardHeaderProps> = ({
  channel,
  isActive,
  isConnected,
}) => {
  const isOnline = channel.status === "ONLINE";

  return (
    <div className={TACTICAL_VIEW_STYLES.CardHeader_div_className}>
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected
              ? TACTICAL_VIEW_STYLES.CardHeader_span_className
              : isOnline
              ? TACTICAL_VIEW_STYLES.CardHeader_span_className_2
              : TACTICAL_VIEW_STYLES.CardHeader_span_className_3
          }`}
        />
        <span className={TACTICAL_VIEW_STYLES.CardHeader_span_className_4}>
          {channel.channelNum}: {channel.name}
        </span>
      </div>

      {isActive ? (
        <span className={TACTICAL_VIEW_STYLES.CardHeader_span_className_5}>
          <CheckCircle2 className="w-3.5 h-3.5" /> PRIMARY VIEWPORT
        </span>
      ) : isConnected ? (
        <span className={TACTICAL_VIEW_STYLES.CardHeader_span_className_6}>
          <Radio className="w-3.5 h-3.5 animate-pulse" /> CONNECTED & LIVE
        </span>
      ) : (
        <span className={TACTICAL_VIEW_STYLES.CardHeader_span_className_7}>
          {channel.status}
        </span>
      )}
    </div>
  );
};

export default CardHeader;
