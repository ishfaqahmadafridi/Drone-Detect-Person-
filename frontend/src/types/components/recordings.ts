import { RefObject, ChangeEvent } from "react";
import { SnapshotItem } from "../index";

// ==========================================
// 12. Recordings & Tactical Video Player Props
// ==========================================
export type RecordingsFilterMode = "all" | "aerial" | "ground" | "video" | "image";

export interface EvidenceRecordRowProps {
  snap: SnapshotItem;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface RecordingsViewProps {
  className?: string;
}

export interface RecordingsHeaderProps {
  totalCount: number;
  filteredCount: number;
  isLoading: boolean;
  onRefresh: () => void;
  isRecording?: boolean;
  onToggleRecording?: () => void;
  isActionLoading?: boolean;
}

export interface RecordingsFilterTabsProps {
  activeFilter: RecordingsFilterMode;
  onFilterChange: (mode: RecordingsFilterMode) => void;
}

export interface RecordDetailPanelProps {
  snap: SnapshotItem;
}

export interface RecordingsEmptyStateProps {
  isLoading: boolean;
}

export interface RecordingsFooterProps {
  totalCount: number;
}

export interface RecordingsListItemProps {
  snap: SnapshotItem;
  isSelected: boolean;
  onSelect: () => void;
}

export interface ListItemThumbnailProps {
  url?: string;
  filename: string;
}

export interface ListItemBadgesProps {
  viewMode?: string;
  filename: string;
}

export interface ListItemTimestampProps {
  createdAt?: string;
}

export interface ListItemFooterProps {
  sizeKb: number;
  filename: string;
}

export interface RecordingsListPaneProps {
  snapshots: SnapshotItem[];
  totalCount: number;
  filteredCount: number;
  isLoading: boolean;
  filterMode: RecordingsFilterMode;
  selectedSnapshot: SnapshotItem | null;
  onSelectSnapshot: (snap: SnapshotItem) => void;
  onFilterChange: (mode: RecordingsFilterMode) => void;
  onRefresh: () => void;
  isRecording?: boolean;
  onToggleRecording?: () => void;
  isActionLoading?: boolean;
}

export interface RecordingsPreviewPaneProps {
  selectedSnapshot: SnapshotItem | null;
  onOpenModal: () => void;
  onClosePreview?: () => void;
}

export interface RecordingsFullscreenModalProps {
  snapshot: SnapshotItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ModalHeaderProps {
  snapshot: SnapshotItem;
  onClose: () => void;
}

export interface ModalImageStageProps {
  url?: string;
  filename: string;
}

export interface TacticalVideoPlayerProps {
  url: string;
  filename: string;
}

export interface PlayerPlaybackRibbonProps {
  label?: string;
}

export interface PlayerViewportProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  url: string;
  isLooping: boolean;
  hasError?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onError?: () => void;
  onTogglePlay: () => void;
}

export interface PlayerTimelineScrubberProps {
  currentTime: number;
  duration: number;
  progressPercent: number;
  onSeek: (e: ChangeEvent<HTMLInputElement>) => void;
  formattedCurrent: string;
  formattedDuration: string;
  isDisabled?: boolean;
}

export interface PlayerTransportControlsProps {
  isPlaying: boolean;
  isDisabled?: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onSkip: (seconds: number) => void;
}

export interface PlayerActionControlsProps {
  playbackRate: number;
  isLooping: boolean;
  isMuted: boolean;
  isDisabled?: boolean;
  onCycleSpeed: () => void;
  onToggleLoop: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export interface PlayerControlsBarProps {
  scrubberProps: PlayerTimelineScrubberProps;
  transportProps: PlayerTransportControlsProps;
  actionProps: PlayerActionControlsProps;
  isDisabled?: boolean;
}

export interface ModalFooterProps {
  snapshot: SnapshotItem;
  onClose: () => void;
}

export interface EmptyPreviewStateProps {
  className?: string;
}

export interface PreviewTopToolbarProps {
  selectedSnapshot: SnapshotItem;
  onOpenModal: () => void;
  onClosePreview?: () => void;
}

export interface PreviewViewportProps {
  selectedSnapshot: SnapshotItem;
  onOpenModal: () => void;
}

export interface PreviewTelemetryAuditProps {
  selectedSnapshot: SnapshotItem;
}
