import type { FrozenSelection, TrackingModeResponse, TargetSelectResponse } from "@/types";
import { apiClient } from "./client";

export const trackingApi = {
  freeze: async (channel?: "ground" | "aerial"): Promise<FrozenSelection> => (await apiClient.post<FrozenSelection>("/tracking/freeze", {}, { params: { channel } })).data,
  commit: async (token: string, selectedIds: number[], channel?: "ground" | "aerial"): Promise<TrackingModeResponse> =>
    (await apiClient.post<TrackingModeResponse>("/tracking/commit", { token, selected_ids: selectedIds }, { params: { channel } })).data,
  resume: async (token: string, channel?: "ground" | "aerial"): Promise<void> => { await apiClient.post("/tracking/resume", { token }, { params: { channel } }); },
  getTrackingStatus: async (): Promise<{ mode: "auto" | "manual"; selected_ids: number[] }> => {
    const { data } = await apiClient.get<{ mode: "auto" | "manual"; selected_ids: number[] }>("/tracking/status");
    return data;
  },

  setMode: async (mode: "auto" | "manual", selectedIds?: number[], channel?: "ground" | "aerial"): Promise<TrackingModeResponse> => {
    const { data } = await apiClient.post<TrackingModeResponse>("/tracking/mode", {
      mode,
      selected_ids: selectedIds,
    }, { params: { channel } });
    return data;
  },

  selectTarget: async (payload: { x?: number; y?: number; target_id?: number }): Promise<TargetSelectResponse> => {
    const { data } = await apiClient.post<TargetSelectResponse>("/tracking/select", payload);
    return data;
  },

  clearTargets: async (): Promise<{ status: string; selected_ids: number[] }> => {
    const { data } = await apiClient.post<{ status: string; selected_ids: number[] }>("/tracking/clear");
    return data;
  },
};
