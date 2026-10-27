import type { UpdateConfigPayload } from "@/types";
export type { UpdateConfigPayload } from "@/types";
import { apiClient } from "./client";
import { SurveillanceConfig } from "@/types";



export const configApi = {
  getConfig: async (): Promise<SurveillanceConfig> => {
    const { data } = await apiClient.get<SurveillanceConfig>("/config");
    return data;
  },

  updateConfig: async (payload: UpdateConfigPayload, channel?: "ground" | "aerial"): Promise<{ message: string; config: SurveillanceConfig }> => {
    const { data } = await apiClient.post<{ message: string; config: SurveillanceConfig }>("/config", payload, { params: { channel } });
    return data;
  },
};
