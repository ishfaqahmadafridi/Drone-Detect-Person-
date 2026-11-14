// ==============================================================================
// Incident Alerts & Evidence Snapshot Types
// ==============================================================================

export interface IncidentAlert {
  timestamp: string;
  threat_level: string;
  total_persons: string;
  intruders_count: string;
  person_ids: string;
  snapshot_path: string;
}

export interface SnapshotItem {
  id?: number;
  filename: string;
  url: string;
  thumbnail_url?: string;
  created_at: string;
  size_kb: number;
  view_mode?: "aerial" | "ground" | string;
  media_type?: "image" | "video";
  threat_level?: string;
  threat_type?: string;
  duration_seconds?: number;
}

export interface EvidenceMetadata {
  datePart: string;
  timePart: string;
}

export interface SnapshotList {
  snapshots: SnapshotItem[];
  /** Total saved snapshots; `snapshots` itself is capped by the backend. */
  total: number;
}
