import { apiClient } from "./client";
import { DroneAvionics, DroneCommandResponse } from "@/types";

export const droneApi = {
  getAvionics: async (): Promise<DroneAvionics> => {
    const { data } = await apiClient.get<DroneAvionics>("/drone/avionics");
    return data;
  },

  sendCommand: async (action: string, targetAltitude?: number): Promise<DroneCommandResponse> => {
    const { data } = await apiClient.post<DroneCommandResponse>("/drone/command", {
      action,
      target_altitude: targetAltitude,
    });
    return data;
  },

  getCameraStatus: async (): Promise<{
    camera_online: boolean;
    camera_resolution: string;
    camera_fps: number;
    camera_sensor_temp_c: number;
    camera_detecting: boolean;
    source_type: string;
    view_mode: string;
  }> => {
    const { data } = await apiClient.get("/drone/camera/status");
    return data;
  },
};
