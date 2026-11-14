
// ==========================================
// 3. Telemetry Cards Component Props
// ==========================================
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




export interface DetectedPersonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode?: "aerial" | "ground";
}

export interface TelemetryCardMetrics {
  totalPersons: number;
  intrudersCount: number;
  fps: number;
  evidenceCount?: number;
}

export interface TelemetryCardDefinition extends TelemetryCardTileProps {
  id: string;
}
