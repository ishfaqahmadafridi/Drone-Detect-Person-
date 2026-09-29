import { useMemo } from "react";
import { EvidenceMetadata, SnapshotItem } from "@/types";
import { getEvidenceMetadata } from "@/utils";

/**
 * Custom hook to extract and memoize formatted evidence metadata
 * (timestamps, perspective labels/badges, and threat classifications).
 */
export function useEvidenceMetadata(
  snapshot?: Partial<SnapshotItem> | null
): EvidenceMetadata {
  return useMemo(() => getEvidenceMetadata(snapshot), [snapshot]);

}
