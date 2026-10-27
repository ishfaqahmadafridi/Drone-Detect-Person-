import { DOMAIN_BADGE_STYLES, THREAT_RIBBON_STYLES } from "@/constants/tactical";
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
    return DOMAIN_BADGE_STYLES.threatDanger;
  }
  return DOMAIN_BADGE_STYLES.threatNormal;
}

/**
 * Returns calm, authoritative ribbon styles for the main header threat banner.
 */
export function getThreatRibbonStyle(threatLevel: ThreatLevel | string): string {
  return THREAT_RIBBON_STYLES[threatLevel as ThreatLevel] ?? THREAT_RIBBON_STYLES.CLEAR;
}
