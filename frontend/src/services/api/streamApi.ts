import { VIDEO_TESTING } from "@/constants/tactical";
import { CHANNEL_REPLAY_PATH, PRIMARY_CAMERA_PATH } from "@/constants/network";
import { apiClient } from "./client";
import {
  StreamSourceType,
  ModelsStatusResponse,
  TestConnectionPayload,
  TestConnectionResponse,
} from "@/types";

export const streamApi = {
  selectCamera: async (cameraId: string): Promise<void> => {
    await apiClient.post(PRIMARY_CAMERA_PATH, {}, { params: { camera_id: cameraId } });
  },
  replayVideo: async (channel: "ground" | "aerial"): Promise<void> => {
    await apiClient.post(CHANNEL_REPLAY_PATH, {}, { params: { channel } });
  },
  switchSource: async (sourceType: StreamSourceType, sourcePath?: string, channel?: "ground" | "aerial"): Promise<{ message: string }> => {
    const safeSourceType = typeof sourceType === "string" ? sourceType : "synthetic";
    const safeSourcePath = typeof sourcePath === "string" && sourcePath.trim().length > 0 ? sourcePath.trim() : undefined;
    const { data } = await apiClient.post<{ message: string }>("/stream/source", {
      source_type: safeSourceType,
      source_path: safeSourcePath,
    }, { params: { channel } });
    return data;
  },

  testConnection: async (payload: TestConnectionPayload): Promise<TestConnectionResponse> => {
    const { data } = await apiClient.post<TestConnectionResponse>("/stream/test-connection", payload);
    return data;
  },

  uploadVideo: async (file: File, onProgress?: (percent: number) => void, channel?: "ground" | "aerial"): Promise<{ message: string; filename: string; filepath: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<{ message: string; filename: string; filepath: string }>(
      "/video/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: VIDEO_TESTING.uploadTimeoutMs,
        params: { channel },
        onUploadProgress: event => onProgress?.(Math.round((event.loaded / (event.total || file.size)) * 100)),
      }
    );
    return data;
  },
  switchView: async (view: "aerial" | "ground"): Promise<{ message: string; active_view: string }> => {
    const { data } = await apiClient.post<{ message: string; active_view: string }>(`/stream/view?view=${view}`);
    return data;
  },

  getModelsStatus: async (): Promise<ModelsStatusResponse> => {
    const { data } = await apiClient.get<ModelsStatusResponse>("/stream/models/status");
    return data;
  },

  captureSnapshot: async (): Promise<{ message: string; filename: string; url: string; view_mode: string }> => {
    const { data } = await apiClient.post<{ message: string; filename: string; url: string; view_mode: string }>("/snapshots/capture");
    return data;
  },
};
