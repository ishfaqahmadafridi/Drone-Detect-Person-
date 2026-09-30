import { apiClient } from "./client";

export interface TrackingModeResponse {
  status: string;
  mode: "auto" | "manual";
  selected_ids: number[];
}

export interface TargetSelectResponse {
  status: string;
  mode: string;
  selected_ids: number[];
  toggled_id?: number;
}

export const trackingApi = {
  getTrackingStatus: async (): Promise<{ mode: "auto" | "manual"; selected_ids: number[] }> => {
    const { data } = await apiClient.get<{ mode: "auto" | "manual"; selected_ids: number[] }>("/tracking/status");
    return data;
  },

  setMode: async (mode: "auto" | "manual", selectedIds?: number[]): Promise<TrackingModeResponse> => {
    const { data } = await apiClient.post<TrackingModeResponse>("/tracking/mode", {
      mode,
      selected_ids: selectedIds,
    });
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
