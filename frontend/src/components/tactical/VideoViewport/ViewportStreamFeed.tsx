"use client";

import React from "react";
import { ViewportStreamFeedProps } from "@/types";

export const ViewportStreamFeed: React.FC<ViewportStreamFeedProps> = ({
  streamKey,
  isLoaded,
  onLoad,
  onError,
}) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={streamKey}
      src={`/api/stream/video_feed?t=${streamKey}`}
      alt="Aerial Drone Video Stream"
      onLoad={onLoad}
      onError={onError}
      className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};
