"use client";

import React from "react";
import { HeaderProps } from "@/types";
import { useTelemetryMetrics } from "@/hooks";
import { BrandCluster } from "./BrandCluster";
import { ThreatRibbon } from "./ThreatRibbon";
import { HeaderActions } from "./HeaderActions";

export const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const { threatLevel, alertMsg, isConnected } = useTelemetryMetrics();

  return (
    <header className="glass-panel-elevated rounded-xl p-3 px-5 flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
      <BrandCluster isConnected={isConnected} />
      <ThreatRibbon threatLevel={threatLevel} alertMsg={alertMsg} />
      <HeaderActions onRefresh={onRefresh} />
    </header>
  );
};

export default Header;
