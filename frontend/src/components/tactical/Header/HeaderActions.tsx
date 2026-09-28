"use client";

import React from "react";
import { HeaderActionsProps } from "@/types";
import { useAudioAlert, useSystemClock } from "@/hooks";
import { AvionicsQuickPills } from "./AvionicsQuickPills";
import { HeaderClock } from "./HeaderClock";
import { CameraWallTrigger } from "./CameraWallTrigger";
import { AudioAlertToggle } from "./AudioAlertToggle";
import { HeaderRefreshButton } from "./HeaderRefreshButton";

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onRefresh,
  onOpenWall,
  avionics,
}) => {
  const { isMuted, toggleMute } = useAudioAlert();
  const { utcTime } = useSystemClock();

  return (
    <div className="flex items-center gap-3">
      {/* 1. Real-Time Avionics Quick Status Pills */}
      <AvionicsQuickPills avionics={avionics} />

      {/* 2. Tactical System Clock */}
      <HeaderClock utcTime={utcTime} />

      {/* 3. Multi-Sensor Camera Wall Trigger */}
      {onOpenWall && <CameraWallTrigger onOpenWall={onOpenWall} />}

      {/* 4. Audio Siren Mute Alert Control */}
      <AudioAlertToggle isMuted={isMuted} onToggleMute={toggleMute} />

      {/* 5. Telemetry & Alerts Refresh */}
      <HeaderRefreshButton onRefresh={onRefresh} />
    </div>
  );
};

export default HeaderActions;
export * from "./AvionicsQuickPills";
export * from "./HeaderClock";
export * from "./CameraWallTrigger";
export * from "./AudioAlertToggle";
export * from "./HeaderRefreshButton";
