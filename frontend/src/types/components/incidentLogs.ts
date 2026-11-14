import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { IncidentAlert } from "../index";
// ==========================================
// 5. Incident Logs Component Props
// ==========================================
export interface EvidenceSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  /** Omit when a count has no meaning for the section. */
  count?: number;
  description: string;
  children?: ReactNode;
}
export interface IncidentHeaderProps {
  count: number;
  isLoading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export interface IncidentItemProps {
  alert: IncidentAlert;
}
