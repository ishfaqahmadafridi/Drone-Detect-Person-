"use client";

import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
import { useTelemetryMetrics } from "@/hooks";
import { BrandCluster } from "./BrandCluster";

export function Header() {
  const { isConnected } = useTelemetryMetrics();

  return (
    <header className={TACTICAL_VIEW_STYLES.Header_header_className}>
      <BrandCluster isConnected={isConnected} />
    </header>
  );
}

export default Header;
