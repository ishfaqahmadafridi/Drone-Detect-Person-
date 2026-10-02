import { RefObject, FormEvent } from "react";
import { StreamSourceType } from "../index";

// ==========================================
// 2. Video Viewport Component Props
// ==========================================
export interface VideoViewportProps {
  onSnapshotTrigger?: () => void;
}

export interface ViewportHeaderProps {
  sourceType: string;
  viewMode?: "aerial" | "ground";
  trackingMode?: "auto" | "manual";
  selectedCount?: number;
  onTrackingModeChange?: (mode: "auto" | "manual") => void;
  onClearSelectedTargets?: () => void;
  isEditingZone?: boolean;
  onToggleEditZone?: () => void;
  onSnapshotTrigger?: () => void;
  onToggleFullscreen: () => void;
}

export interface SensorTitleClusterProps {
  className?: string;
}

export interface ViewportSourceBadgeProps {
  sourceType: string;
}

export interface ViewportPerspectiveBadgeProps {
  viewMode?: "aerial" | "ground";
}

export interface DetectionModeToggleProps {
  trackingMode?: "auto" | "manual";
  selectedCount?: number;
  onTrackingModeChange?: (mode: "auto" | "manual") => void;
  onClearSelectedTargets?: () => void;
}

export interface ViewportHeaderActionsProps {
  onSnapshotTrigger?: () => void;
  onToggleFullscreen: () => void;
}

export interface ViewportScreenProps {
  containerRef: RefObject<HTMLDivElement | null>;
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  streamKey: number;
  fps: number;
  streamError: boolean;
  onStreamLoad: () => void;
  onStreamError: () => void;
  trackingMode?: "auto" | "manual";
  onSelectTargetAt?: (normX: number, normY: number) => void;
  isEditingZone?: boolean;
  onCanvasMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp?: () => void;
  onSaveZone?: () => void;
  onResetZone?: () => void;
  onClearZone?: () => void;
  onCancelZone?: () => void;
}

export interface ViewportStandbyLoaderProps {
  isLoaded: boolean;
}

export interface ViewportStreamFeedProps {
  streamKey: number;
  isLoaded: boolean;
  onLoad: () => void;
  onError: () => void;
}

export interface ViewportCanvasLayerProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isEditingZone: boolean;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: () => void;
}

export interface ViewportHudReticleProps {
  className?: string;
}

export interface ViewportTelemetryBadgesProps {
  fps: number;
  latencyMs?: number;
  resolution?: string;
  engine?: string;
}

export interface ViewportHudOverlayProps {
  fps: number;
  isEditingZone?: boolean;
  onSaveZone?: () => void;
  onResetZone?: () => void;
  onClearZone?: () => void;
  onCancelZone?: () => void;
}

export interface ZoneBannerProps {
  onSave: () => void;
  onReset: () => void;
  onClear?: () => void;
  onCancel: () => void;
}

export interface UseZoneCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isEditingZone: boolean;
  initialPolygon?: [number, number][];
  onSaveZone: (points: [number, number][]) => Promise<void>;
}

export interface StreamToolbarProps {
  sourceType: string;
  viewMode?: "aerial" | "ground";
  showRtspField: boolean;
  isConnectingRtsp: boolean;
  rtspInput: string;
  onSourceSelect: (type: StreamSourceType) => void;
  onViewSelect?: (view: "aerial" | "ground") => void;
  onRtspInputChange: (val: string) => void;
  onRtspSubmit: (e: FormEvent) => void;
  onSnapshotTrigger?: () => void;
  onToggleFullscreen?: () => void;
  onOpenEvidence?: () => void;
}

export interface StreamZoomControlsProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
}

export interface StreamFilterControlsProps {
  isNightVision: boolean;
  onToggleNightVision: () => void;
}

export interface StreamActionButtonsProps {
  onSnapshotTrigger?: () => void;
  onOpenEvidence?: () => void;
  onToggleFullscreen?: () => void;
}



export interface StreamSourceSelectorProps {
  sourceType: string;
  viewMode?: "aerial" | "ground";
  onSourceSelect: (type: StreamSourceType) => void;
}

export interface PerspectiveToggleProps {
  viewMode?: "aerial" | "ground";
  onViewSelect: (view: "aerial" | "ground") => void;
}

export interface StreamRtspFormProps {
  show: boolean;
  isConnectingRtsp: boolean;
  rtspInput: string;
  onRtspInputChange: (val: string) => void;
  onRtspSubmit: (e: FormEvent) => void;
  placeholder?: string;
  buttonLabel?: string;
}
