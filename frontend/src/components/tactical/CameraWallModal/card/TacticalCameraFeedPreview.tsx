"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import { useToggle } from "@/hooks/useToggle";
import React from "react";
import { TacticalCameraFeedPreviewProps } from "@/types";
import { getCameraStreamUrl, getChannelStreamUrl } from "@/constants/network";
import { useAppSelector } from "@/store";
import { useVideoStreamUrl } from "@/hooks/useVideoStreamUrl";
import { TACTICAL_FEED_PREVIEW_TOKENS } from "@/constants/tactical";
import { ShieldAlert } from "lucide-react";

export const TacticalCameraFeedPreview: React.FC<TacticalCameraFeedPreviewProps> = ({
  channel,
  isActive,
  className = "",
  onSelect,
}) => {
  const [streamError, setStreamError] = useToggle(false);
  const isConnected = useAppSelector(state => state.telemetry.connected_camera_ids.includes(channel.id));
  const streamUrl = useVideoStreamUrl(isActive ? getChannelStreamUrl(channel.viewMode, 0, channel.id) : getCameraStreamUrl(channel.id));

  const tokens = TACTICAL_FEED_PREVIEW_TOKENS;
  const resolutionDisplay = channel.resolution || tokens.labels.defaultFpsResolution;

  return (
    <div
      onClick={onSelect}
      className={`${TACTICAL_VIEW_STYLES.TacticalCameraFeedPreview_div_className}${className}`}
    >
      {isActive || isConnected ? (
        <>
          {/* Active Live Video Stream from Backend */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={streamUrl}
            alt={channel.name}
            onLoad={() => setStreamError(false)}
            onError={() => setStreamError(true)}
            className="w-full h-full object-cover pointer-events-none"
          />

          {streamError && (
            <div className={TACTICAL_VIEW_STYLES.TacticalCameraFeedPreview_div_className_2}>
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span className="font-mono-code text-[10px] tracking-wider uppercase">
                {tokens.labels.feedReestablishing}
              </span>
            </div>
          )}

          {/* Active Live HUD Overlay */}
          <div className={TACTICAL_VIEW_STYLES.TacticalCameraFeedPreview_div_className_3}>
            <span className={TACTICAL_VIEW_STYLES.TacticalCameraFeedPreview_span_className} />
            <span>{tokens.labels.liveAiDetect}</span>
          </div>

          <div className={TACTICAL_VIEW_STYLES.TacticalCameraFeedPreview_div_className_4}>
            {channel.channelNum} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ {resolutionDisplay}
          </div>
        </>
      ) : (
        <span className={TACTICAL_VIEW_STYLES.TacticalCameraFeedPreview_span_className_2}>Camera inactive — select to connect</span>
      )}

      {/* Persistent Bottom Location Banner on Video */}
      <div className={TACTICAL_VIEW_STYLES.TacticalCameraFeedPreview_div_className_5}>
        {channel.location}
      </div>
    </div>
  );
};

export default TacticalCameraFeedPreview;
