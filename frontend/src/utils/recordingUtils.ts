import { RECORDINGS_PERSPECTIVE_LABELS, RECORDINGS_PERSPECTIVE_COLORS } from "@/constants/tactical";
import { EvidenceMetadata, SnapshotItem } from "@/types";

export interface ParsedTimestamp {
  datePart: string;
  timePart: string;
}

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
  if (lower.includes("multi") || lower.includes("gathering")) return "MULTI-PERSON GATHERING";
  if (lower.includes("perimeter")) return "PERIMETER TRIPWIRE";
  return "SECURITY ALERT";
}

export function getThreatBadgeClass(threatType: string = ""): string {
  const upper = threatType.toUpperCase();
  if (upper.includes("INTRUSION")) {
    return "bg-rose-500/20 text-rose-300 border-rose-500/40";
  }
  if (upper.includes("MULTI") || upper.includes("GATHERING")) {
    return "bg-amber-500/20 text-amber-300 border-amber-500/40";
  }
  return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
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
