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
