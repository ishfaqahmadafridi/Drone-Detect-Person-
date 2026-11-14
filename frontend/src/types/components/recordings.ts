import { SnapshotItem } from "../index";

// ==========================================
// 12. Recordings & Tactical Video Player Props
// ==========================================
export interface RecordingsViewProps {
  className?: string;
}


export interface RecordingRowProps {
  item: SnapshotItem;
  onPlay: (item: SnapshotItem) => void;
}
