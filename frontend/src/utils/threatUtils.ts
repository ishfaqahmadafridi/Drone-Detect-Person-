import { THREAT_RIBBON_STYLES } from "@/constants/tactical";
import { ThreatLevel } from "@/types";

/**
 * Checks if the threat level represents an intrusion or critical danger.
 */
export function isThreatDanger(threatLevel: ThreatLevel | string): boolean {
  return threatLevel === "INTRUSION";
}


/**
 * Returns calm, authoritative ribbon styles for the main header threat banner.
 */
export function getThreatRibbonStyle(threatLevel: ThreatLevel | string): string {
  return THREAT_RIBBON_STYLES[threatLevel as ThreatLevel] ?? THREAT_RIBBON_STYLES.CLEAR;
}
