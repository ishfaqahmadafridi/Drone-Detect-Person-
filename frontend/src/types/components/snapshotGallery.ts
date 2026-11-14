import { SnapshotItem } from "../index";

// ==========================================
// 6. Snapshot Gallery Component Props
// ==========================================
export type SnapshotFilter = "all" | "aerial" | "ground";

export interface SnapshotHeaderProps {
  count: number;
  description: string;
  isLoading: boolean;
  onRefresh: () => void;
  filterMode?: SnapshotFilter;
  onFilterChange?: (filter: SnapshotFilter) => void;
}

export interface SnapshotCardProps {
  snapshot: SnapshotItem;
  onClick: () => void;
}

export interface EvidenceViewerModalProps {
  item: SnapshotItem | null;
  onClose: () => void;
}

export interface EvidenceMediaProps {
  item: SnapshotItem;
  isVideo: boolean;
}
