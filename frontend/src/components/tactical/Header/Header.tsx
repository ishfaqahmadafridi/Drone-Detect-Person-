"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
    <header className={TACTICAL_VIEW_STYLES.Header_header_className}>
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
