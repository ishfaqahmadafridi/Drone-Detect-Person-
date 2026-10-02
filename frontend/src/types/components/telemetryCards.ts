import { ReactNode } from "react";

// ==========================================
// 3. Telemetry Cards Component Props
// ==========================================
export interface MetricTileProps {
  title: string;
  icon: ReactNode;
  value: string | number;
  subValue: string;
  progressPercent?: number;
  progressBarColor?: string;
  isAlertActive?: boolean;
  alertBorderColor?: string;
  className?: string;
  onClick?: () => void;
  actionHint?: string;
  isClickable?: boolean;
  showProgressLine?: boolean;
}

export interface PersonsMetricCardProps {
  count: number;
  viewMode?: "aerial" | "ground";
  onClick?: () => void;
}

export interface TelemetryCardsProps {
  viewMode?: "aerial" | "ground";
  layout?: "horizontal" | "grid";
}

export interface TelemetryCardTileProps {
  title: string;
  value: string;
  subText: string;
  isAlert?: boolean;
  onClick?: () => void;
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

export interface DetectedPersonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode?: "aerial" | "ground";
}
