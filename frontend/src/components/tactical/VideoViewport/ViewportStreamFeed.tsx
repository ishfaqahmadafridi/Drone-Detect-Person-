import React from "react";
import { ViewportStreamFeedProps } from "@/types";
import { getVideoStreamUrl } from "@/constants/network";
import { useAppSelector } from "@/store";

export const ViewportStreamFeed: React.FC<ViewportStreamFeedProps> = ({
  streamKey,
  onLoad,
  onError,
}) => {
  const zoomLevel = useAppSelector((state) => state.telemetry.zoom_level ?? 1.0);
  const isNightVision = useAppSelector((state) => state.telemetry.is_night_vision ?? false);

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={streamKey}
        src={getVideoStreamUrl(streamKey)}
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
