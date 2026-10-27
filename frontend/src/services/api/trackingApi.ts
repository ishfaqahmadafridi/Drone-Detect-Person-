import type { FrozenSelection, TrackingModeResponse, TargetSelectResponse } from "@/types";
import { apiClient } from "./client";

export const trackingApi = {
  freeze: async (channel: "ground" | "aerial" = "ground"): Promise<FrozenSelection> =>
    (await apiClient.post<FrozenSelection>("/tracking/freeze", {}, { params: { channel } })).data,
  commit: async (token: string, selectedIds: number[], channel: "ground" | "aerial" = "ground"): Promise<TrackingModeResponse> =>
    (await apiClient.post<TrackingModeResponse>("/tracking/commit", { token, selected_ids: selectedIds }, { params: { channel } })).data,
  resume: async (token: string, channel: "ground" | "aerial" = "ground"): Promise<void> => {
    await apiClient.post("/tracking/resume", { token }, { params: { channel } });
  },
  getTrackingStatus: async (channel?: "ground" | "aerial"): Promise<{ mode: "auto" | "manual"; selected_ids: number[] }> => {
    const { data } = await apiClient.get<{ mode: "auto" | "manual"; selected_ids: number[] }>("/tracking/status", { params: { channel } });
    return data;
  },

  setMode: async (mode: "auto" | "manual", selectedIds?: number[], channel: "ground" | "aerial" = "ground"): Promise<TrackingModeResponse> => {
    const { data } = await apiClient.post<TrackingModeResponse>("/tracking/mode", {
      mode,
      selected_ids: selectedIds,
    }, { params: { channel } });
    return data;
  },

  selectTarget: async (payload: { x?: number; y?: number; target_id?: number }, channel: "ground" | "aerial" = "ground"): Promise<TargetSelectResponse> => {
    const { data } = await apiClient.post<TargetSelectResponse>("/tracking/select", payload, { params: { channel } });
    return data;
  },

  clearTargets: async (channel: "ground" | "aerial" = "ground"): Promise<{ status: string; selected_ids: number[] }> => {
    const { data } = await apiClient.post<{ status: string; selected_ids: number[] }>("/tracking/clear", {}, { params: { channel } });
    return data;
  },
};
