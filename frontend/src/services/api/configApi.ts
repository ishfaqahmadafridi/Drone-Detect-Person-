import { apiClient } from "./client";
import { SurveillanceConfig } from "@/types";

export interface UpdateConfigPayload {
  multi_person_threshold?: number;
  confidence_threshold?: number;
  proximity_alert_distance_px?: number;
  zone_polygon?: [number, number][];
}

export const configApi = {
  getConfig: async (): Promise<SurveillanceConfig> => {
    const { data } = await apiClient.get<SurveillanceConfig>("/config");
    return data;
  },

  updateConfig: async (payload: UpdateConfigPayload): Promise<{ message: string; config: SurveillanceConfig }> => {
    const { data } = await apiClient.post<{ message: string; config: SurveillanceConfig }>("/config", payload);
    return data;
  },
};
