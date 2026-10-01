import { apiClient } from "./client";
import {
  StreamSourceType,
  ModelsStatusResponse,
  TestConnectionPayload,
  TestConnectionResponse,
} from "@/types";

export const streamApi = {
  switchSource: async (sourceType: StreamSourceType, sourcePath?: string): Promise<{ message: string }> => {
    const safeSourceType = typeof sourceType === "string" ? sourceType : "synthetic";
    const safeSourcePath = typeof sourcePath === "string" && sourcePath.trim().length > 0 ? sourcePath.trim() : undefined;
    const { data } = await apiClient.post<{ message: string }>("/stream/source", {
      source_type: safeSourceType,
      source_path: safeSourcePath,
    });
    return data;
  },

  testConnection: async (payload: TestConnectionPayload): Promise<TestConnectionResponse> => {
    const { data } = await apiClient.post<TestConnectionResponse>("/stream/test-connection", payload);
    return data;
  },

  uploadVideo: async (file: File): Promise<{ message: string; filename: string; filepath: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<{ message: string; filename: string; filepath: string }>(
      "/video/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
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
