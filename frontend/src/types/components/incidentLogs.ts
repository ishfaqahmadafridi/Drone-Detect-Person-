import { IncidentAlert } from "../index";

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
