import { RefObject, ChangeEvent, FormEvent, ReactNode } from "react";
import { ThreatLevel, StreamSourceType, IncidentAlert, SnapshotItem } from "./index";

// ==========================================
// 1. Header Component Props
// ==========================================
export interface HeaderProps {
  onRefresh: () => void;
}

export interface BrandClusterProps {
  isConnected: boolean;
}

export interface ThreatRibbonProps {
  threatLevel: ThreatLevel;
  alertMsg: string;
}

export interface HeaderActionsProps {
  onRefresh: () => void;
}

// ==========================================
// 2. Video Viewport Component Props
// ==========================================
export interface VideoViewportProps {
  onSnapshotTrigger?: () => void;
}

export interface ViewportHeaderProps {
  sourceType: string;
  isEditingZone: boolean;
  onToggleEditZone: () => void;
  onSnapshotTrigger?: () => void;
  onToggleFullscreen: () => void;
}

export interface ViewportScreenProps {
  containerRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  streamKey: number;
  fps: number;
  isEditingZone: boolean;
  onStreamError: () => void;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: () => void;
  onSaveZone: () => void;
  onResetZone: () => void;
  onCancelZone: () => void;
}

export interface ZoneBannerProps {
  onSave: () => void;
  onReset: () => void;
  onCancel: () => void;
}

export interface StreamToolbarProps {
  sourceType: string;
  showUploadField: boolean;
  showRtspField: boolean;
  isUploading: boolean;
  isConnectingRtsp: boolean;
  rtspInput: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onSourceSelect: (type: StreamSourceType) => void;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRtspInputChange: (val: string) => void;
  onRtspSubmit: (e: FormEvent) => void;
}

// ==========================================
// 3. Telemetry Cards Component Props
// ==========================================
export interface MetricTileProps {
  title: string;
  icon: ReactNode;
  value: string | number;
  subValue: string;
  progressPercent: number;
  progressBarColor?: string;
  isAlertActive?: boolean;
  alertBorderColor?: string;
  className?: string;
}

export interface PersonsMetricCardProps {
  count: number;
}

export interface IntrudersMetricCardProps {
  count: number;
}

export interface GatheringsMetricCardProps {
  count: number;
  threshold: number;
}

export interface SpeedMetricCardProps {
  fps: number;
}

// ==========================================
// 4. Tuning Panel Component Props
// ==========================================
export interface TuningHeaderProps {
  showSavedToast: boolean;
}

export interface TuningSliderProps {
  label: string;
  badgeValue: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
}

// ==========================================
// 5. Incident Logs Component Props
// ==========================================
export interface IncidentHeaderProps {
  count: number;
  isLoading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export interface IncidentItemProps {
  alert: IncidentAlert;
}

// ==========================================
// 6. Snapshot Gallery Component Props
// ==========================================
export interface SnapshotHeaderProps {
  count: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export interface SnapshotCardProps {
  snapshot: SnapshotItem;
  onClick: () => void;
}

export interface SnapshotModalProps {
  snapshot: SnapshotItem | null;
  onClose: () => void;
}

// ==========================================
// 7. Context & Provider Interfaces
// ==========================================
export interface AudioAlertContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playIntrusionSiren: () => void;
  playWarningBeep: () => void;
}

export interface AudioAlertProviderProps {
  children: ReactNode;
}

export interface WebSocketContextType {
  reconnect: () => void;
}

export interface WebSocketProviderProps {
  children: ReactNode;
}
