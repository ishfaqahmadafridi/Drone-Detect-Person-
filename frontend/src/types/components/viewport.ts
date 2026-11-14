import { RefObject } from "react";
import type { LucideIcon } from "lucide-react";
import { TacticalCameraChannel } from "./cameraWall";

// ==========================================
// 2. Video Viewport Component Props
// ==========================================
export interface VideoViewportProps {
  onSnapshotTrigger?: ViewportAction;
  onManageCameras?: () => void;
}
export type ViewportLayoutMode = "single" | "dual" | "quad";

export interface ViewportSplitGridProps {
  layoutMode: "dual" | "quad";
  activeCameraId: string;
  fps: number;
  onSelectCamera: (channel: TacticalCameraChannel) => void;
}

export interface UseViewportSplitGridProps {
  layoutMode: "dual" | "quad";
  onSelectCamera: (channel: TacticalCameraChannel) => void;
}

export interface UseViewportSplitGridReturn {
  channelsToDisplay: readonly TacticalCameraChannel[];
  gridClass: string;
  handlePromoteCamera: (channel: TacticalCameraChannel) => void;
  handleDisconnectCamera: (cameraId: string) => void;
}

export interface ViewportLayoutOption {
  mode: ViewportLayoutMode;
  label: string;
  tooltip: string;
  icon: LucideIcon;
  minCameras: number;
}

export interface UseViewportScreenReturn {
  zoomLevel: number;
  isNightVision: boolean;
  activeCameraId: string;
  handleSelectCamera: (cam: TacticalCameraChannel) => void;
}

export type ViewportAction = () => void | Promise<void>;
export type ViewportActionName = "snapshot" | "fullscreen";

export interface ViewportHeaderProps extends ViewportHeaderActionsProps {
  onManageCameras?: () => void;
  layoutMode: ViewportLayoutMode;
  connectedCameraCount: number;
  onLayoutChange: (mode: ViewportLayoutMode) => void;
}

export interface ViewportLayoutSelectorProps {
  layoutMode: ViewportLayoutMode;
  onLayoutChange: (mode: ViewportLayoutMode) => void;
  connectedCameraCount: number;
}

export interface SensorTitleClusterProps {
  className?: string;
}

export interface ViewportHeaderActionsProps {
  onSnapshotTrigger?: ViewportAction;
  onToggleFullscreen: ViewportAction;
  isFullscreen: boolean;
  fullscreenSupported: boolean;
}

export interface ViewportScreenProps {
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  streamKey: number;
  fps: number;
  streamError: boolean;
  layoutMode?: ViewportLayoutMode;
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

export interface ClassificationLegendItem {
  label: string;
  dotClass: string;
}

export interface ClassificationLegendBadgeProps {
  className?: string;
}

export interface ViewportHudOverlayProps {
  fps: number;
  isEditingZone?: boolean;
  onSaveZone?: () => void;
  onResetZone?: () => void;
  onClearZone?: () => void;
  onCancelZone?: () => void;
}

export interface UseZoneCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isEditingZone: boolean;
  initialPolygon?: [number, number][];
  onSaveZone: (points: [number, number][]) => Promise<void>;
}

export interface StreamZoomControlsProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
}

export interface StreamFilterControlsProps {
  isNightVision: boolean;
  onToggleNightVision: () => void;
}
