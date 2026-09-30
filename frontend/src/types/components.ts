import { RefObject, FormEvent, ReactNode } from "react";
import { ThreatLevel, StreamSourceType, IncidentAlert, SnapshotItem, DroneAvionics, TacticalNavTab } from "./index";

// ==========================================
// 1. Header Component Props
// ==========================================
export interface HeaderProps {
  onRefresh: () => void;
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
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
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
}

export interface AvionicsQuickPillsProps {
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
}

export interface FlightStatePillProps {
  flightState: string;
  isAirborne: boolean;
  altitude: number;
  heading: number;
}

export interface DroneBatteryPillProps {
  batteryPct: number;
  isBatteryLow: boolean;
  health: number;
  voltage: number;
}

export interface GroundSensorPillProps {
  sensorId?: string;
  name?: string;
  mountHeight?: string;
}

export interface GroundPowerPillProps {
  powerSource?: string;
  powerStatus?: string;
}

export interface AerialAvionicsPillsProps {
  avionics?: DroneAvionics;
}

export interface GroundPerimeterPillsProps {
  className?: string;
}

export interface HeaderClockProps {
  utcTime?: string;
}

export interface CameraWallTriggerProps {
  onOpenWall: () => void;
}

export interface AudioAlertToggleProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export interface HeaderRefreshButtonProps {
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
  viewMode?: "aerial" | "ground";
}

export interface TelemetryCardsProps {
  viewMode?: "aerial" | "ground";
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

// ==========================================
// 8. Drone Flight & Avionics Component Props
// ==========================================
export interface DroneAvionicsCardProps {
  avionics?: DroneAvionics;
  onOpenFlightDeck?: () => void;
  onConnectAirLink?: () => void;
}

export interface AvionicsCardHeaderProps {
  flightState: string;
}

export interface BatteryHealthGaugeProps {
  battery: number;
  voltage: number;
  health: number;
  flightTime: number;
}

export interface FlightPhysicsGridProps {
  altitude: number;
  speed: number;
  sats: number;
}

export interface OpticalSensorStatusProps {
  camOnline: boolean;
  camDetecting: boolean;
}

export interface AvionicsActionButtonsProps {
  onOpenFlightDeck?: () => void;
  onConnectAirLink?: () => void;
}


export interface FlightControlDeckProps {
  flightState: string;
  altitude: number;
  batteryPercent: number;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
}

export interface FlightDeckHeaderProps {
  className?: string;
}

export interface FlightTelemetryBarProps {
  altitude: number;
  batteryPercent: number;
  flightState: string;
}

export interface FlightActionGridProps {
  flightState: string;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
}

// ==========================================
// 8B. Ground Perimeter CCTV Component Props
// ==========================================
export interface PerimeterCameraCardProps {
  onOpenWall?: () => void;
  onReconnectStream?: () => void;
  className?: string;
}

export interface PerimeterCardHeaderProps {
  cameraId?: string;
  isOnline?: boolean;
}

export interface PerimeterPowerStatusProps {
  powerSource?: string;
  powerStatus?: string;
  voltage?: string;
}

export interface PerimeterOpticsGridProps {
  mountHeight?: string;
  lens?: string;
  tamperStatus?: string;
}

export interface PerimeterNetworkStatusProps {
  networkProtocol?: string;
  resolution?: string;
  fps?: number;
  isDetecting?: boolean;
}

export interface PerimeterActionButtonsProps {
  onOpenWall?: () => void;
  onReconnectStream?: () => void;
}

export interface PerimeterSecurityDeckProps {
  onReconnectStream?: () => void;
  onSnapshotTrigger?: () => void;
  className?: string;
}

export interface PerimeterDeckHeaderProps {
  className?: string;
}

export interface PerimeterTelemetryBarProps {
  cameraId?: string;
  mountHeight?: string;
  resolution?: string;
}

export interface PerimeterActionGridProps {
  onReconnectStream?: () => void;
  onSnapshotTrigger?: () => void;
}

export interface PerimeterZoomControlProps {
  activeZoom: number;
  onZoomChange: (zoom: number) => void;
}

export interface PerimeterNightVisionButtonProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export interface PerimeterReconnectButtonProps {
  onReconnect?: () => void;
}

export interface PerimeterSnapshotButtonProps {
  onSnapshot?: () => void;
}


export interface CameraWallModalProps {
  isOpen: boolean;
  activeSource: string;
  onClose: () => void;
  onSelectFeed: (feedType: StreamSourceType, viewMode: "aerial" | "ground") => void;
  onConnectRtsp?: (url: string) => void;
}

export interface CameraWallHeaderProps {
  onClose: () => void;
}

export interface AerialFeedCardProps {
  isActive: boolean;
  onSelect: () => void;
}

export interface MobileGroundFeedCardProps {
  isActive: boolean;
  onConnectRtsp?: (url: string) => void;
}

export interface MobileGroundCardHeaderProps {
  isActive: boolean;
}

export interface MobilePixelQuickConnectProps {
  onConnectRtsp?: (url: string) => void;
}

export interface MobileCustomStreamFormProps {
  onConnectRtsp?: (url: string) => void;
}

export interface ThermalFeedCardProps {
  isActive: boolean;
  onSelect: () => void;
}

export interface SatelliteFeedCardProps {
  isActive: boolean;
  onSelect: () => void;
}

// ==========================================
// 9. Tactical Sidebar Component Props
// ==========================================
export interface TacticalSidebarProps {
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenWall?: () => void;
  avionics?: DroneAvionics;
  isMuted: boolean;
  onToggleMute: () => void;
  threatLevel: ThreatLevel;
  viewMode?: "aerial" | "ground";
  onViewSelect?: (view: "aerial" | "ground") => void;
}

export interface SidebarPerspectiveToggleProps {
  viewMode: "aerial" | "ground";
  onViewSelect: (view: "aerial" | "ground") => void;
  isCollapsed: boolean;
}

export interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  flightState: string;
  isAirborne: boolean;
  viewMode?: "aerial" | "ground";
}


export interface SidebarNavListProps {
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  isCollapsed: boolean;
  threatLevel: ThreatLevel;
  onOpenWall?: () => void;
}


export interface NavItemConfig {
  id: TacticalNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SidebarNavItemProps {
  item: NavItemConfig;
  isActive: boolean;
  isCollapsed: boolean;
  threatLevel: ThreatLevel;
  onSelect: (id: TacticalNavTab) => void;
}

export interface SidebarCameraWallTriggerProps {
  isCollapsed: boolean;
  onOpenWall: () => void;
}

export interface SidebarTelemetryWidgetProps {
  batteryPct: number;
  isBatteryLow: boolean;
  altitude: number;
  speed: number;
  viewMode?: "aerial" | "ground";
}

export interface SidebarFooterProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isCollapsed: boolean;
}

export interface SidebarTopSectionProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  flightState: string;
  isAirborne: boolean;
  viewMode?: "aerial" | "ground";
  onViewSelect?: (view: "aerial" | "ground") => void;
  activeTab: TacticalNavTab;
  onTabChange: (tab: TacticalNavTab) => void;
  onOpenWall?: () => void;
  threatLevel: ThreatLevel;
}

export interface SidebarBottomSectionProps {
  isCollapsed: boolean;
  batteryPct: number;
  isBatteryLow: boolean;
  altitude: number;
  speed: number;
  viewMode?: "aerial" | "ground";
  isMuted: boolean;
  onToggleMute: () => void;
}



// ==========================================
// 10. Dashboard View Component Props
// ==========================================
export interface AirspaceCommandViewProps {
  onSnapshotTrigger: () => void;
  flightState: string;
  altitude: number;
  batteryPercent: number;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  onConnectAirLink?: () => void;
  onOpenFlightDeck: () => void;
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
}

export interface IncidentAuditViewProps {
  className?: string;
}

export interface CalibrationViewProps {
  avionics?: DroneAvionics;
  onOpenFlightDeck: () => void;
  onConnectAirLink?: () => void;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
}

export interface TacticalViewRouterProps {
  activeTab: TacticalNavTab;
  onSnapshotTrigger: () => void;
  flightState: string;
  altitude: number;
  batteryPercent: number;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  onConnectAirLink?: () => void;
  onOpenFlightDeck: () => void;
  avionics?: DroneAvionics;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
}

export interface MissionCommandViewportProps {
  activeTab: TacticalNavTab;
  avionics?: DroneAvionics;
  flightState: string;
  altitude: number;
  batteryPercent: number;
  isCommandPending: boolean;
  onCommand: (action: string) => void;
  onConnectAirLink?: () => void;
  onOpenFlightDeck: () => void;
  onRefresh: () => void;
  onSnapshotTrigger?: () => void;
  viewMode?: "aerial" | "ground";
  onOpenWall?: () => void;
}

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
  videoRef: React.RefObject<HTMLVideoElement | null>;
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
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
