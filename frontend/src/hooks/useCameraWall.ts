"use client";

import { useState } from "react";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { useAppSelector } from "@/store";
import { StreamSourceType } from "@/types";

export function useCameraWall() {
  const [isOpen, setIsOpen] = useState(false);
  const { source_type } = useAppSelector((state) => state.telemetry);
  const { switchSource, switchView } = useStreamMutation();

  const openWall = () => setIsOpen(true);
  const closeWall = () => setIsOpen(false);

  const selectFeed = async (feedType: StreamSourceType, viewMode: "aerial" | "ground") => {
    await switchSource.mutateAsync({ sourceType: feedType });
    await switchView.mutateAsync(viewMode);
    setIsOpen(false);
  };

  const connectRtsp = async (rtspUrl: string, viewMode: "aerial" | "ground" = "ground") => {
    await switchSource.mutateAsync({ sourceType: "rtsp", sourcePath: rtspUrl });
    await switchView.mutateAsync(viewMode);
    setIsOpen(false);
  };

  return {
    isWallOpen: isOpen,
    activeSource: source_type,
    openWall,
    closeWall,
    selectFeed,
    connectRtsp,
  };
}
