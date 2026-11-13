"use client";

import { BRAND_IDENTITY } from "@/constants/tactical";
import type { BrandClusterProps } from "@/types";
import { BrandMark } from "../branding/BrandMark";
import { TelemetryConnectionBadge } from "./TelemetryConnectionBadge";

export function BrandCluster({ isConnected }: BrandClusterProps) {
  return (
    <div className={BRAND_IDENTITY.clusterClass}>
      <BrandMark className={BRAND_IDENTITY.headerMarkClass} />
      <div className={BRAND_IDENTITY.wordmarkGroupClass}>
        <span className={BRAND_IDENTITY.wordmarkClass}>{BRAND_IDENTITY.name}</span>
        <span className={BRAND_IDENTITY.taglineClass}>{BRAND_IDENTITY.tagline}</span>
      </div>
      <div className={BRAND_IDENTITY.connectionDividerClass}>
        <TelemetryConnectionBadge isConnected={isConnected} />
      </div>
    </div>
  );
}

export default BrandCluster;
