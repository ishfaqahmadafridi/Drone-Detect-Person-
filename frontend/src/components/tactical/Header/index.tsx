"use client";

import React from "react";
import { HeaderProps } from "@/types";
import { useTelemetryMetrics } from "@/hooks";
import { BrandCluster } from "./BrandCluster";
import { ThreatRibbon } from "./ThreatRibbon";
import { HeaderActions } from "./HeaderActions";

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  avionics,
  viewMode: propViewMode,
}) => {
  const { threatLevel, alertMsg, isConnected, viewMode: hookViewMode } = useTelemetryMetrics();
  const activeViewMode = propViewMode || hookViewMode || "aerial";

  return (
    <header className="glass-panel-elevated rounded-xl p-3 px-5 flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
      <BrandCluster isConnected={isConnected} />
      <ThreatRibbon threatLevel={threatLevel} alertMsg={alertMsg} />
      <HeaderActions
        onRefresh={onRefresh}
        avionics={avionics}
        viewMode={activeViewMode}
      />
    </header>
  );
};

export default Header;
