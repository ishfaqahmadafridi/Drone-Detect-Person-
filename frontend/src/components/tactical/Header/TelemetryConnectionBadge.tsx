import { Radio, CircleDashed } from "lucide-react";
import { BRAND_IDENTITY } from "@/constants/tactical";
import type { BrandClusterProps } from "@/types";

export function TelemetryConnectionBadge({ isConnected }: BrandClusterProps) {
  const state = BRAND_IDENTITY.connection[isConnected ? "live" : "offline"];
  const Icon = isConnected ? Radio : CircleDashed;

  return (
    <span role="status" aria-live="polite" aria-label={state.description} title={state.description}
      className={`${BRAND_IDENTITY.connectionClass} ${state.className}`}>
      <Icon aria-hidden="true" className={BRAND_IDENTITY.connectionIconClass} strokeWidth={1.75} />
      <span>{state.label}</span>
    </span>
  );
}
