"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SidebarFooterProps } from "@/types";
import { Volume2, VolumeX, Zap } from "lucide-react";
import { useInferenceModel } from "@/hooks";

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isMuted,
  onToggleMute,
  isCollapsed,
}) => {
  const activeEngine = useInferenceModel();

  return (
    <div className={TACTICAL_VIEW_STYLES.SidebarFooter_div_className}>
      {/* Siren Alert Toggle */}
      <button
        onClick={onToggleMute}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border font-display text-xs font-semibold uppercase tracking-wider transition-all ${
          !isMuted
            ? TACTICAL_VIEW_STYLES.AudioAlertToggle_button_className
            : TACTICAL_VIEW_STYLES.SidebarFooter_button_className
        } ${isCollapsed ? "justify-center px-0" : ""}`}
        title={!isMuted ? "Audio Siren Active (Click to Mute)" : "Audio Siren Muted (Click to Unmute)"}
        aria-label={!isMuted ? "Mute audio siren" : "Unmute audio siren"}
      >
        {!isMuted ? (
          <Volume2 className={TACTICAL_VIEW_STYLES.SidebarFooter_Volume2_className} />
        ) : (
          <VolumeX className="w-3.5 h-3.5 shrink-0" />
        )}
        {!isCollapsed && <span>{!isMuted ? "SIREN ENGAGED" : "AUDIO MUTED"}</span>}
      </button>

      {/* AI Engine & System Pill */}
      {!isCollapsed && (
        <div className={TACTICAL_VIEW_STYLES.SidebarFooter_div_className_2}>
          <span className="flex items-center gap-1 truncate" title={`Active Vision Model Engine: ${activeEngine}`}>
            <Zap className={TACTICAL_VIEW_STYLES.ListItemTimestamp_Clock_className} />
            <span className="truncate">{activeEngine}</span>
          </span>
          <span className={TACTICAL_VIEW_STYLES.SidebarFooter_span_className}>ONLINE</span>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
