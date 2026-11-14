import type { EvidenceMetadata, ParsedTimestamp, SnapshotItem } from "@/types";

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

export function getEvidenceMetadata(snapshot?: Partial<SnapshotItem> | null): EvidenceMetadata {
  return parseEvidenceTimestamp(snapshot?.created_at);
}

export type { ParsedTimestamp } from "@/types";
