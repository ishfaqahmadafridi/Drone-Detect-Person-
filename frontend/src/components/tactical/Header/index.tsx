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
    <header className="h-14 border-b border-slate-700/60 bg-[#0B0E14] px-6 flex items-center justify-between z-30 shrink-0 select-none">
      <BrandCluster isConnected={isConnected} />
      <div className="flex items-center gap-3">
        <ThreatRibbon threatLevel={threatLevel} alertMsg={alertMsg} />
        <HeaderActions
          onRefresh={onRefresh}
          avionics={avionics}
          viewMode={activeViewMode}
        />
      </div>
    </header>
  );
};

export default Header;
