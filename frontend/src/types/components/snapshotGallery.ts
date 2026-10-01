import { SnapshotItem } from "../index";

// ==========================================
// 6. Snapshot Gallery Component Props
// ==========================================
export interface SnapshotHeaderProps {
  count: number;
  isLoading: boolean;
  onRefresh: () => void;
  filterMode?: "all" | "aerial" | "ground";
  onFilterChange?: (filter: "all" | "aerial" | "ground") => void;
}

export interface SnapshotCardProps {
  snapshot: SnapshotItem;
  onClick: () => void;
}

export interface SnapshotModalProps {
  snapshot: SnapshotItem | null;
  onClose: () => void;
}
