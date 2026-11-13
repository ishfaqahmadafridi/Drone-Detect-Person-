"use client";
import { STATUS_ICON, TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SidebarSystemHealthProps } from "@/types";
import { useTelemetryMetrics, useSystemClock } from "@/hooks";
import { Activity } from "lucide-react";

export const SidebarSystemHealth: React.FC<SidebarSystemHealthProps> = ({ isCollapsed = false }) => {
  const { fps, isConnected } = useTelemetryMetrics();
  const { utcTime } = useSystemClock();
  const linkTone = isConnected ? STATUS_ICON.ok : STATUS_ICON.warn;

  if (isCollapsed) {
    return (
      <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className}>
        <Activity aria-label={isConnected ? "Telemetry live" : "Telemetry offline"} className={`${STATUS_ICON.base} ${linkTone}`} />
      </div>
    );
  }

  return (
    <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_2}>
      <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_3}>
        SYSTEM HEALTH
      </div>

      <div className="flex flex-col gap-2 font-mono-code text-xs">
        <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_4}>
          <span>Telemetry</span>
          <span className={`${TACTICAL_VIEW_STYLES.ModalFooter_strong_className} ${linkTone}`}>{isConnected ? "Live" : "Offline"}</span>
        </div>

        <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_4}>
          <span>Inference</span>
          <span className={TACTICAL_VIEW_STYLES.ModalFooter_strong_className}>{fps.toFixed(1)} FPS</span>
        </div>

        <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_4}>
          <span>UTC time</span>
          <span className={TACTICAL_VIEW_STYLES.ModalFooter_strong_className} suppressHydrationWarning>
            {utcTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarSystemHealth;
