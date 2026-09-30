"use client";

import React from "react";
import { ViewportStreamFeedProps } from "@/types";
import { getVideoStreamUrl } from "@/constants/network";

export const ViewportStreamFeed: React.FC<ViewportStreamFeedProps> = ({
  streamKey,
  onLoad,
  onError,
}) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={streamKey}
      src={getVideoStreamUrl(streamKey)}
      alt="Aerial Drone Video Stream"
      onLoad={onLoad}
      onError={onError}
      className="w-full h-full object-contain pointer-events-none"
    />
  );
};
