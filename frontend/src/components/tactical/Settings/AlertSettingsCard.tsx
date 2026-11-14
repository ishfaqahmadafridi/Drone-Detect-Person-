"use client";
import React from "react";
import { BellRing, Volume2 } from "lucide-react";
import { EVIDENCE_UI, SETTINGS_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { useAudioAlert } from "@/hooks/useAudioAlert";
import { EvidenceSectionHeader } from "../IncidentLogs/EvidenceSectionHeader";

export const AlertSettingsCard: React.FC = () => {
  const { isMuted, toggleMute, playIntrusionSiren } = useAudioAlert();
  const state = isMuted ? "off" : "on";

  return (
    <section aria-label="Alert settings" className={EVIDENCE_UI.cardClass}>
      <EvidenceSectionHeader icon={BellRing} title="Alerts"  description="What happens when someone enters a restricted zone." />
      <div className={SETTINGS_UI.settingRowClass}>
        <div className={SETTINGS_UI.settingTextClass}>
          <p id="siren-label" className={SETTINGS_UI.channelTitleClass}>Intrusion siren</p>
          <p className={SETTINGS_UI.channelMetaClass}>Plays a sound in this browser on every intrusion. Evidence frames are saved either way.</p>
        </div>
        <button type="button" role="switch" aria-checked={!isMuted} aria-labelledby="siren-label" onClick={toggleMute} className={VIDEO_TOOLS.switchTrackClass[state]}>
          <span aria-hidden="true" className={VIDEO_TOOLS.switchThumbClass[state]} />
        </button>
      </div>
      <div>
        <button type="button" onClick={playIntrusionSiren} disabled={isMuted} className={VIDEO_TOOLS.secondaryButtonClass}>
          <Volume2 aria-hidden="true" className="h-4 w-4" />Play test sound
        </button>
      </div>
    </section>
  );
};

export default AlertSettingsCard;
