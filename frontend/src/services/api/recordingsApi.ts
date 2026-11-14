import type { RecordingStatusResponse, StartRecordingResponse, StopRecordingResponse, EvidenceListResponse } from "@/types";
export type { RecordingStatusResponse, StartRecordingResponse, StopRecordingResponse, EvidenceListResponse } from "@/types";
import { apiClient } from "./client";
import { resolveMediaUrl } from "@/constants/network";
import type { EvidenceCleanupResult, EvidenceStorageStats, SnapshotItem, SnapshotList } from "@/types";









/** Evidence rows use `file_size_kb`; the UI uses `size_kb`. URLs must point at the API host. */
export function normalizeRecording(record: SnapshotItem & { file_size_kb?: number }): SnapshotItem {
  return { ...record, url: resolveMediaUrl(record.url), size_kb: record.size_kb ?? record.file_size_kb ?? 0 };
}

export const recordingsApi = {
  getEvidence: async (params?: {
    view?: string;
    media_type?: string;
    threat_level?: string;
    limit?: number;
    offset?: number;
  }): Promise<EvidenceListResponse> => {
    const { data } = await apiClient.get<EvidenceListResponse>("/evidence", { params });
    return data;
  },

  /** Saved video recordings, newest first, with playable absolute URLs. */
  listRecordings: async (limit = 200): Promise<SnapshotList> => {
    const data = await recordingsApi.getEvidence({ media_type: "video", limit });
    const snapshots = (data.records ?? []).map(normalizeRecording);
    return { snapshots, total: data.total ?? snapshots.length };
  },

  getRecordingStatus: async (): Promise<RecordingStatusResponse> => {
    const { data } = await apiClient.get<RecordingStatusResponse>("/recordings/status");
    return data;
  },

  startRecording: async (): Promise<StartRecordingResponse> => {
    const { data } = await apiClient.post<StartRecordingResponse>("/recordings/start");
    return data;
  },

  stopRecording: async (): Promise<StopRecordingResponse> => {
    const { data } = await apiClient.post<StopRecordingResponse>("/recordings/stop");
    return data;
  },

  recordClip: async (duration: number = 5.0): Promise<{ message: string; view_mode: string; threat_level: string }> => {
    const { data } = await apiClient.post<{ message: string; view_mode: string; threat_level: string }>(
      `/recordings/clip?duration=${duration}`
    );
    return data;
  },

  getStorageStats: async (): Promise<EvidenceStorageStats> => {
    const { data } = await apiClient.get<EvidenceStorageStats>("/evidence/stats");
    return data;
  },

  cleanupEvidence: async (olderThanDays: number, mediaType: "image" | "video" = "image"): Promise<EvidenceCleanupResult> => {
    const { data } = await apiClient.post<EvidenceCleanupResult>("/evidence/cleanup", { older_than_days: olderThanDays, media_type: mediaType });
    return data;
  },

  deleteEvidence: async (recordId: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(`/evidence/${recordId}`);
    return data;
  },
};
