import { ThreatLevel } from "@/types";

/**
 * Checks if the threat level represents an intrusion or critical danger.
 */
export function isThreatDanger(threatLevel: ThreatLevel | string): boolean {
  return threatLevel === "INTRUSION";
}

/**
 * Checks if the threat level represents a multi-person gathering or warning.
 */
export function isThreatWarning(threatLevel: ThreatLevel | string): boolean {
  return threatLevel === "MULTI_PERSON";
}

/**
 * Checks if the threat level is monitoring or clear.
 */
export function isThreatMonitoring(threatLevel: ThreatLevel | string): boolean {
  return threatLevel === "MONITORING";
}

/**
 * Returns tactical CSS styles for threat badges across incident and log cards.
 */
export function getThreatBadgeStyle(threatLevel: ThreatLevel | string): string {
  if (isThreatDanger(threatLevel)) {
    return "bg-red-500/20 text-red-400";
  }
  if (isThreatWarning(threatLevel)) {
    return "bg-amber-500/20 text-amber-400";
  }
  return "bg-cyan-500/20 text-cyan-400";
}

/**
 * Returns tactical ribbon styles for the main header threat banner.
 */
export function getThreatRibbonStyle(threatLevel: ThreatLevel | string): string {
  switch (threatLevel) {
    case "INTRUSION":
      return "bg-red-950/60 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse";
    case "MULTI_PERSON":
      return "bg-amber-950/60 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]";
    case "MONITORING":
      return "bg-cyan-950/40 border-cyan-500 text-cyan-300";
    default:
      return "bg-emerald-950/40 border-emerald-500 text-emerald-300";
  }
}
