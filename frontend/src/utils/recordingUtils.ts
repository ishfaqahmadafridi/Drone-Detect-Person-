import type { ParsedTimestamp } from "@/types";
import { RECORDINGS_PERSPECTIVE_LABELS, RECORDINGS_PERSPECTIVE_COLORS, DOMAIN_BADGE_STYLES } from "@/constants/tactical";
import { EvidenceMetadata, SnapshotItem } from "@/types";



export function parseEvidenceTimestamp(rawTimestamp?: string): ParsedTimestamp {
  if (!rawTimestamp) {
    return { datePart: "—", timePart: "—" };
  }
  const parts = rawTimestamp.trim().split(" ");
  return {
    datePart: parts[0] || "—",
    timePart: parts[1] || "—",
  };
}

export function getPerspectiveLabel(perspective?: string): string {
  const key = perspective || "aerial";
  return RECORDINGS_PERSPECTIVE_LABELS[key] || key.toUpperCase();
}

export function getPerspectiveBadgeClass(perspective?: string): string {
  const key = perspective || "aerial";
  return RECORDINGS_PERSPECTIVE_COLORS[key] || RECORDINGS_PERSPECTIVE_COLORS.aerial;
}

export function parseThreatType(filename: string = ""): string {
  const lower = filename.toLowerCase();
  if (lower.includes("intrusion")) return "ZONE INTRUSION";
  if (lower.includes("perimeter")) return "PERIMETER TRIPWIRE";
  return "SECURITY ALERT";
}

export function getThreatBadgeClass(threatType: string = ""): string {
  const upper = threatType.toUpperCase();
  if (upper.includes("INTRUSION")) {
    return DOMAIN_BADGE_STYLES.evidenceDanger;
  }
  return DOMAIN_BADGE_STYLES.evidenceNormal;
}

export function getEvidenceMetadata(
  snapshot?: Partial<SnapshotItem> | null
): EvidenceMetadata {
  const { datePart, timePart } = parseEvidenceTimestamp(snapshot?.created_at);
  const perspectiveLabel = getPerspectiveLabel(snapshot?.view_mode);
  const perspectiveBadgeClass = getPerspectiveBadgeClass(snapshot?.view_mode);
  const threatType = snapshot?.threat_type || parseThreatType(snapshot?.filename || "");
  const threatBadgeClass = getThreatBadgeClass(threatType);

  return {
    datePart,
    timePart,
    perspectiveLabel,
    perspectiveBadgeClass,
    threatType,
    threatBadgeClass,
  };
}

export type { ParsedTimestamp } from "@/types";
