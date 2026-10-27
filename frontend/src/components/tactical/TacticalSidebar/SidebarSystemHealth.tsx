"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SidebarSystemHealthProps } from "@/types";
import { useTelemetryMetrics, useSystemClock } from "@/hooks";

export const SidebarSystemHealth: React.FC<SidebarSystemHealthProps> = ({
  telemetryHz = 10,
  inferenceFps,
  lastSync,
  isCollapsed = false,
}) => {
  const { fps } = useTelemetryMetrics();
  const { utcTime } = useSystemClock();

  if (isCollapsed) {
    return (
      <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className}>
        <span className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_span_className} />
        <span>10Hz</span>
      </div>
    );
  }

  const displayFps = (inferenceFps ?? (fps > 0 ? fps : 29.8)).toFixed(1);
  const displaySync = lastSync || utcTime;

  return (
    <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_2}>
      <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_3}>
        SYSTEM HEALTH
      </div>

      <div className="flex flex-col gap-2 font-mono-code text-xs">
        <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_4}>
          <span>Telemetry</span>
          <span className={TACTICAL_VIEW_STYLES.ModalFooter_strong_className}>{telemetryHz} Hz</span>
        </div>

        <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_4}>
          <span>Inference</span>
          <span className={TACTICAL_VIEW_STYLES.ModalFooter_strong_className}>{displayFps} FPS</span>
        </div>

        <div className={TACTICAL_VIEW_STYLES.SidebarSystemHealth_div_className_4}>
          <span>Last sync</span>
          <span className={TACTICAL_VIEW_STYLES.ModalFooter_strong_className} suppressHydrationWarning>
            {displaySync}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarSystemHealth;
