import React from "react";
import { ViewportStreamFeedProps } from "@/types";
import { getChannelStreamUrl } from "@/constants/network";
import { useAppSelector } from "@/store";
import { useVideoStreamUrl } from "@/hooks/useVideoStreamUrl";

export const ViewportStreamFeed: React.FC<ViewportStreamFeedProps> = ({
  streamKey,
  onLoad,
  onError,
}) => {
  const zoomLevel = useAppSelector((state) => state.telemetry.zoom_level ?? 1.0);
  const isNightVision = useAppSelector((state) => state.telemetry.is_night_vision ?? false);
  const viewMode = useAppSelector((state) => state.telemetry.view_mode);
  const cameraId = useAppSelector(state => state.telemetry.primary_camera_ids[viewMode === "ground" ? "ground" : "aerial"]);
  const streamUrl = useVideoStreamUrl(getChannelStreamUrl(viewMode === "ground" ? "ground" : "aerial", streamKey, cameraId));

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`${viewMode}:${cameraId}:${streamKey}`}
        src={streamUrl}
        alt="Tactical Surveillance Video Stream"
        onLoad={onLoad}
        onError={onError}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease",
          filter: isNightVision
            ? "grayscale(100%) contrast(140%) brightness(115%)"
            : "none",
        }}
        className="w-full h-full object-contain pointer-events-none will-change-transform"
        suppressHydrationWarning
      />
    </div>
  );
};
