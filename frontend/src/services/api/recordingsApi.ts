import { apiClient } from "./client";
import { SnapshotItem } from "@/types";

export interface RecordingStatusResponse {
  is_recording: boolean;
}

export interface StartRecordingResponse {
  message: string;
  filename: string;
  view_mode: string;
  is_recording: boolean;
}

export interface StopRecordingResponse {
  message: string;
  record: SnapshotItem;
}

export interface EvidenceListResponse {
  total: number;
  count: number;
  records: SnapshotItem[];
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

  deleteEvidence: async (recordId: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(`/evidence/${recordId}`);
    return data;
  },
};
