import { ThreatLevel } from "@/types";

/**
 * Checks if the threat level represents an intrusion or critical danger.
 */
export function isThreatDanger(threatLevel: ThreatLevel | string): boolean {
  return threatLevel === "INTRUSION";
}


/**
 * Checks if the threat level is monitoring or clear.
 */
export function isThreatMonitoring(threatLevel: ThreatLevel | string): boolean {
  return threatLevel === "MONITORING";
}

/**
 * Returns clean enterprise CSS styles for threat badges across incident and log cards.
 */
export function getThreatBadgeStyle(threatLevel: ThreatLevel | string): string {
  if (isThreatDanger(threatLevel)) {
    return "bg-red-500/10 text-red-400 border border-red-500/25";
  }
  return "bg-blue-500/10 text-blue-400 border border-blue-500/25";
}

/**
 * Returns calm, authoritative ribbon styles for the main header threat banner.
 */
export function getThreatRibbonStyle(threatLevel: ThreatLevel | string): string {
  switch (threatLevel) {
    case "INTRUSION":
      return "bg-red-950/30 border-red-500/50 text-red-300";
    case "MONITORING":
      return "bg-blue-950/30 border-blue-500/40 text-blue-300";
    case "MANUAL":
      return "bg-slate-900/80 border-slate-700 text-slate-300";
    default:
      return "bg-emerald-950/30 border-emerald-500/40 text-emerald-300";
  }
}
