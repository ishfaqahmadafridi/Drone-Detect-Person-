import { apiClient } from "./client";
import { DroneCommandResponse } from "@/types";

export const droneApi = {
  sendCommand: async (action: string, targetAltitude?: number): Promise<DroneCommandResponse> => {
    const { data } = await apiClient.post<DroneCommandResponse>("/drone/command", {
      action,
      target_altitude: targetAltitude,
    });
    return data;
  },
};
