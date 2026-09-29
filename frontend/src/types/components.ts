import { RefObject, FormEvent, ReactNode } from "react";
import { ThreatLevel, StreamSourceType, IncidentAlert, SnapshotItem, DroneAvionics, TacticalNavTab } from "./index";

// ==========================================
// 1. Header Component Props
// ==========================================
export interface HeaderProps {
  onRefresh: () => void;
  avionics?: DroneAvionics;
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
}

export interface AvionicsQuickPillsProps {
  avionics?: DroneAvionics;
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
  isEditingZone: boolean;
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
}

export interface SidebarFooterProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isCollapsed: boolean;
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
}

export interface IncidentAuditViewProps {
  className?: string;
}

export interface CalibrationViewProps {
  avionics?: DroneAvionics;
  onOpenFlightDeck: () => void;
  onConnectAirLink?: () => void;
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
}

export type RecordingsFilterMode = "all" | "aerial" | "ground";

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
}

export interface RecordingsPreviewPaneProps {
  selectedSnapshot: SnapshotItem | null;
  onOpenModal: () => void;
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
}

export interface PreviewViewportProps {
  selectedSnapshot: SnapshotItem;
  onOpenModal: () => void;
}

export interface PreviewTelemetryAuditProps {
  selectedSnapshot: SnapshotItem;
}
