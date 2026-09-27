import { apiClient } from "./client";
import { StreamSourceType, ModelsStatusResponse } from "@/types";

export const streamApi = {
  switchSource: async (sourceType: StreamSourceType, sourcePath?: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>("/stream/source", {
      source_type: sourceType,
      source_path: sourcePath,
    });
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
};
