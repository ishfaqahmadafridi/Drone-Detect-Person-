"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { HeaderActionsProps } from "@/types";
import { useAudioAlert } from "@/hooks";
import { Activity, Volume2, VolumeX } from "lucide-react";

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onRefresh,
}) => {
  const { isMuted, toggleMute } = useAudioAlert();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRefresh}
        title="Refresh Telemetry Feed"
        className={TACTICAL_VIEW_STYLES.HeaderActions_button_className}
      >
        <Activity className={TACTICAL_VIEW_STYLES.GroundStep3Form_Network_className} />
        <span>Telemetry</span>
      </button>

      <button
        onClick={toggleMute}
        title={isMuted ? "Audio siren muted - click to enable" : "Audio siren active - click to mute"}
        className={TACTICAL_VIEW_STYLES.HeaderActions_button_className_2}
      >
        {isMuted ? <VolumeX className={TACTICAL_VIEW_STYLES.HeaderActions_VolumeX_className} /> : <Volume2 className={TACTICAL_VIEW_STYLES.HeaderActions_Volume2_className} />}
      </button>
    </div>
  );
};

export default HeaderActions;
