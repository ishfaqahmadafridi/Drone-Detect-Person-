import { ReactNode } from "react";

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
